import express from 'express';
import logger from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import Administrador from './administrador.js';
import Juego from './juego.js';

const port = 3000;

// Inicializar express
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Permite este origen específico
    methods: ["GET", "POST"],        // Métodos permitidos
    credentials: true                // Si necesitas cookies o encabezados adicionales
  }
});

app.use(logger('dev'));

// Estructura para almacenar partidas y usuarios
const partidas = {};
const usuarios = {};

io.on('connection', (socket) => {
  console.log('a user connected');
  // Pruebas de Pozo no borrar
  // const juego = new Juego(2, 2, "Normal");
  // // let movimiento = juego.buscarMovimientos(8,6);
  // juego.testBoard();
  // juego.imprimirTablero();
  // let movimientosComplentos = juego.obtenerMovimientosYsaltos(15,7);
  // console.log("movimientos completos",movimientosComplentos.saltos);
  // console.log("Ganador",juego.verificarGanador(2));

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
    const jugador = { nickname, avatar: usuarios[socket.id].avatar };
    partidas[idPartida] = {
      id: idPartida,
      creador: nickname,
      tipoJuego,
      cantidadJugadores,
      jugadores: [jugador],
      estado: 'esperando',
      administrador: new Administrador(idPartida, cantidadJugadores, tipoJuego, 0) // Inicializar el administrador del juego
    };
    partidas[idPartida].administrador.agregarJugador(jugador); // Agregar el creador al administrador
    socket.join(idPartida);
    io.emit('partidasActualizadas', JSON.parse(JSON.stringify(sanitizePartidas(partidas))));
    socket.emit('partidaCreada', { idPartida });

    // Iniciar contador de 3 minutos para cerrar la partida si no se completa
    partidas[idPartida].timeout = setTimeout(() => {
      if (partidas[idPartida] && partidas[idPartida].estado === 'esperando') {
        delete partidas[idPartida];
        io.emit('partidasActualizadas', JSON.parse(JSON.stringify(sanitizePartidas(partidas))));
      }
    }, 3 * 60 * 1000); // 3 minutos
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
      console.log('Uniendo a la partida:', jugador);
      partidas[idPartida].jugadores.push(jugador);
      partidas[idPartida].administrador.agregarJugador(jugador);
      socket.join(idPartida);
      io.emit('jugadoresActualizados', JSON.parse(JSON.stringify(sanitizePartida(partidas[idPartida]))));
      if (partidas[idPartida].jugadores.length === partidas[idPartida].cantidadJugadores) {
        partidas[idPartida].estado = 'completa';
        io.emit('partidaCompleta', JSON.parse(JSON.stringify(sanitizePartida(partidas[idPartida]))));
        // Iniciar el juego
        partidas[idPartida].administrador.iniciarJuego();
        console.log('Tablero actual:', partidas[idPartida].administrador.obtenerTablero());
        io.emit('tableroActualizado', partidas[idPartida].administrador.obtenerTablero());
        io.emit('turnoActualizado', 0); // Iniciar con el primer jugador
      }
      io.emit('partidasActualizadas', JSON.parse(JSON.stringify(sanitizePartidas(partidas))));
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
      io.emit('tableroActualizado', partida.administrador.obtenerTablero());
      // Actualizar el turno
      partida.administrador.turnoActual = (partida.administrador.turnoActual + 1) % partida.jugadores.length;
      io.emit('turnoActualizado', partida.administrador.turnoActual);
    }
  });

  // Obtener creador de la partida
  socket.on('obtenerCreador', (idPartida, callback) => {
    if (partidas[idPartida]) {
      callback({ creador: partidas[idPartida].creador, cantidadJugadores: partidas[idPartida].cantidadJugadores });
    }
  });

  // Cancelar partida
  socket.on('cancelarPartida', (idPartida) => {
    if (partidas[idPartida]) {
      clearTimeout(partidas[idPartida].timeout);
      delete partidas[idPartida];
      io.emit('partidasActualizadas', JSON.parse(JSON.stringify(sanitizePartidas(partidas))));
    }
  });

  // Desconectar usuario
  socket.on('disconnect', () => {
    delete usuarios[socket.id];
  });
});

// Función para eliminar propiedades circulares
function sanitizePartidas(partidas) {
  const sanitizedPartidas = {};
  for (const id in partidas) {
    sanitizedPartidas[id] = { ...partidas[id] };
    delete sanitizedPartidas[id].timeout;
    if (sanitizedPartidas[id].administrador && sanitizedPartidas[id].administrador.juego) {
      delete sanitizedPartidas[id].administrador.juego.areaJuego; // Eliminar cualquier otra referencia circular
    }
  }
  return sanitizedPartidas;
}

function sanitizePartida(partida) {
  const sanitizedPartida = { ...partida }; // Copiar partida
  delete sanitizedPartida.timeout;

  // Si existe un administrador, eliminar referencias circulares
  if (sanitizedPartida.administrador && sanitizedPartida.administrador.juego) {
    delete sanitizedPartida.administrador.juego.areaJuego;
  }

  // Asegurarse de que jugadores sea un array
  if (!Array.isArray(sanitizedPartida.jugadores)) {
    sanitizedPartida.jugadores = Object.values(sanitizedPartida.jugadores || []);
  }

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