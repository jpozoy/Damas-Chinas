import express from 'express';
import logger from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import Administrador from './administrador.js';

const port = 3000;

// Inicializar express
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(logger('dev'));

// Estructura para almacenar partidas y usuarios
const partidas = {};
const usuarios = {};

io.on('connection', (socket) => {
  // Inicializar la propiedad personalizada
  socket.partidaID = null;

  // Enviar las partidas actuales al cliente recién conectado
  socket.emit('partidasActualizadas', JSON.parse(JSON.stringify(sanitizePartidas(partidas))));

  // Manejar autenticación del usuario
  socket.on('autenticar', ({ nickname, avatar }) => {
    usuarios[socket.id] = { nickname, avatar };
    socket.emit('autenticado', { success: true, nickname, avatar });
  });

  // Crear partida
  socket.on('crearPartida', ({ nickname, tipoJuego, cantidadJugadores }) => {
    if (!usuarios[socket.id]) {
      socket.emit('error', { message: 'Usuario no autenticado' });
      return;
    }
    const idPartida = `partida-${Date.now()}`;
    partidas[idPartida] = {
      id: idPartida,
      creador: nickname,
      tipoJuego,
      cantidadJugadores,
      jugadores: [{ nickname, avatar: usuarios[socket.id].avatar }],
      estado: 'esperando',
      administrador: new Administrador(idPartida, cantidadJugadores, tipoJuego, 0)
    };

    socket.partidaID = idPartida; // Asociar el socket a la partida
    partidas[idPartida].timeout = setTimeout(() => {
      if (partidas[idPartida] && partidas[idPartida].estado === 'esperando') {
        delete partidas[idPartida];
        actualizarPartidas();
      }
    }, 3 * 60 * 1000); // 3 minutos

    actualizarPartidas();
    socket.emit('partidaCreada', { idPartida });
  });

  // Unirse a partida
  socket.on('unirsePartida', ({ idPartida, nickname }) => {
    if (!partidas[idPartida]) {
      socket.emit('error', { message: 'Partida no encontrada' });
      return;
    }
    if (!usuarios[socket.id]) {
      socket.emit('error', { message: 'Usuario no autenticado' });
      return;
    }
    if (partidas[idPartida].jugadores.length < partidas[idPartida].cantidadJugadores) {
      const jugador = { nickname, avatar: usuarios[socket.id].avatar };
      partidas[idPartida].jugadores.push(jugador);
      partidas[idPartida].administrador.agregarJugador(jugador);
      socket.partidaID = idPartida;

      // Emitir evento a todos los jugadores de la partida
      emitirAlaPartida(idPartida, 'jugadoresActualizados', sanitizePartida(partidas[idPartida].jugadores));

      if (partidas[idPartida].jugadores.length === partidas[idPartida].cantidadJugadores) {
        partidas[idPartida].estado = 'completa';
        emitirAlaPartida(idPartida, 'partidaCompleta', sanitizePartida(partidas[idPartida]));
        partidas[idPartida].administrador.iniciarJuego();
        emitirAlaPartida(idPartida, 'tableroActualizado', partidas[idPartida].administrador.obtenerTablero());
        emitirAlaPartida(idPartida, 'turnoActualizado', 0); // Iniciar con el primer jugador
      }
      actualizarPartidas();
    } else {
      socket.emit('error', { message: 'Partida llena' });
    }
  });

  // Manejar movimiento de ficha
  socket.on('moverFicha', ({ idPartida, coordenadaInicial, coordenadaFinal }) => {
    const partida = partidas[idPartida];
    if (partida) {
      const jugador = partida.jugadores[partida.administrador.turnoActual];
      partida.administrador.moverFicha(jugador, coordenadaInicial, coordenadaFinal);
      emitirAlaPartida(idPartida, 'tableroActualizado', partida.administrador.obtenerTablero());
      partida.administrador.turnoActual = (partida.administrador.turnoActual + 1) % partida.jugadores.length;
      emitirAlaPartida(idPartida, 'turnoActualizado', partida.administrador.turnoActual);
    }
  });

  // Cancelar partida
  socket.on('cancelarPartida', (idPartida) => {
    if (partidas[idPartida]) {
      clearTimeout(partidas[idPartida].timeout);
      delete partidas[idPartida];
      actualizarPartidas();
    }
  });

  // Desconectar usuario
  socket.on('disconnect', () => {
    const partidaID = socket.partidaID;
    if (partidaID && partidas[partidaID]) {
      partidas[partidaID].jugadores = partidas[partidaID].jugadores.filter(j => j.nickname !== usuarios[socket.id]?.nickname);
      emitirAlaPartida(partidaID, 'jugadoresActualizados', sanitizePartida(partidas[partidaID].jugadores));
    }
    delete usuarios[socket.id];
  });
});

// Funciones auxiliares
function actualizarPartidas() {
  io.emit('partidasActualizadas', JSON.parse(JSON.stringify(sanitizePartidas(partidas))));
}

function emitirAlaPartida(idPartida, evento, data) {
  io.sockets.sockets.forEach((socket) => {
    if (socket.partidaID === idPartida) {
      socket.emit(evento, data);
    }
  });
}

function sanitizePartidas(partidas) {
  const sanitizedPartidas = {};
  for (const id in partidas) {
    sanitizedPartidas[id] = { ...partidas[id] };
    delete sanitizedPartidas[id].timeout;
  }
  return sanitizedPartidas;
}

function sanitizePartida(partida) {
  const sanitizedPartida = { ...partida };
  delete sanitizedPartida.timeout;
  return sanitizedPartida;
}

// Definir la ruta principal
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

// Iniciar el servidor
server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
