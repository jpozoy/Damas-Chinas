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
const io = new Server(server);

app.use(logger('dev'));

// Estructura para almacenar partidas y usuarios
const partidas = {};
const usuarios = {};

io.on('connection', (socket) => {
  console.log('a user connected');

  
  // Pruebas de Pozo no borrar
  const juego = new Juego(2, 6, "Normal");
  // let movimiento = juego.buscarMovimientos(8,6);
  juego.testBoard();
  juego.imprimirTablero();
  let movimientosComplentos = juego.obtenerMovimientosYsaltos(15,7);
  console.log("movimientos completos",movimientosComplentos.saltos);
  // let movimientos = juego.buscarMovimientos(14,7);
  // console.log("movimientos",movimientos);
  // let movimientosFiltrados = juego.filtrarMovimientosValidos(movimientos);
  // console.log("movimientos filtrados",movimientosFiltrados);
  // let saltos = juego.buscarSaltos(15,7);
  // console.log("saltos adyacentes",saltos);
  // let saltosProfundos = juego.getSaltosRecursivos(15,7);
  // juego.moverFicha([15,7],[13,8]);
  // console.log("saltos profundos",saltosProfundos);
  // juego.imprimirTablero();
  // console.log('a user connected');


  // Pruebas de Joza no borrar
    // // Emitir el tablero actual al cliente
  // socket.emit('tablero', administrador.obtenerTablero());
  // console.log(administrador.obtenerTablero());

  // // Emitir el jugador actual
  // socket.emit('jugadorActual', administrador.jugadores[0]);

  // socket.on('disconnect', () => {
  //   console.log('user disconnected');
  // });

  // // Manejar el evento de movimiento de ficha
  // socket.on('moverFicha', ({ jugador, coordInicial, posicionDestino }) => {
  //   administrador.moverFicha(jugador, coordInicial, posicionDestino);
  //   io.emit('tablero', administrador.obtenerTablero());
  // });

  // // Manejar el evento para obtener movimientos posibles
  // socket.on('obtenerMovimientos', ({ coordInicial }) => {
  //   const movimientos = administrador.juego.buscarMovimientos(coordInicial[0], coordInicial[1]);
  //   socket.emit('movimientosPosibles', movimientos);
  // });


  // Enviar las partidas actuales al cliente recién conectado
  socket.emit('partidasActualizadas', JSON.parse(JSON.stringify(sanitizePartidas(partidas))));

  // Manejar autenticación del usuario
  socket.on('autenticar', ({ nickname, avatar }) => {
    usuarios[socket.id] = { nickname, avatar };
    socket.emit('autenticado', { success: true, nickname, avatar });
    console.log('Usuario autenticado:', usuarios[socket.id]);
  });

  // Crear partida
  socket.on('crearPartida', ({ nickname, tipoJuego, cantidadJugadores }) => {
    if (!usuarios[socket.id]) {
      console.log('Usuario no autenticado');
      console.log('nickname:', nickname);
      console.log('usuarios:', usuarios[socket.id]);
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
    };
    socket.join(idPartida);
    io.emit('partidasActualizadas', JSON.parse(JSON.stringify(sanitizePartidas(partidas))));
    socket.emit('partidaCreada', { idPartida });
    console.log('Partida creada:', partidas[idPartida]);

    // Iniciar contador de 3 minutos para cerrar la partida si no se completa
    partidas[idPartida].timeout = setTimeout(() => {
      if (partidas[idPartida] && partidas[idPartida].estado === 'esperando') {
        delete partidas[idPartida];
        io.emit('partidasActualizadas', JSON.parse(JSON.stringify(sanitizePartidas(partidas))));
        console.log('Partida eliminada por tiempo de espera:', idPartida);
      }
    }, 3 * 60 * 1000); // 3 minutos
  });

  // Unirse a partida
  socket.on('unirsePartida', ({ idPartida, nickname }) => {
    if (!usuarios[socket.id]) {
      socket.emit('error', { message: 'Usuario no autenticado' });
      return;
    }
    if (partidas[idPartida] && partidas[idPartida].jugadores.length < partidas[idPartida].cantidadJugadores) {
      partidas[idPartida].jugadores.push({ nickname, avatar: usuarios[socket.id].avatar });
      socket.join(idPartida);
      io.to(idPartida).emit('jugadoresActualizados', JSON.parse(JSON.stringify(sanitizePartidas(partidas[idPartida].jugadores))));
      if (partidas[idPartida].jugadores.length === partidas[idPartida].cantidadJugadores) {
        partidas[idPartida].estado = 'completa';
        io.to(idPartida).emit('partidaCompleta', JSON.parse(JSON.stringify(sanitizePartidas(partidas[idPartida]))));
      }
      io.emit('partidasActualizadas', JSON.parse(JSON.stringify(sanitizePartidas(partidas))));
      console.log('Jugador unido:', partidas[idPartida]);
    }
  });

  // Obtener creador de la partida
  socket.on('obtenerCreador', (idPartida, callback) => {
    if (partidas[idPartida]) {
      callback({ creador: partidas[idPartida].creador });
    }
  });

  // Cancelar partida
  socket.on('cancelarPartida', (idPartida) => {
    if (partidas[idPartida]) {
      clearTimeout(partidas[idPartida].timeout);
      delete partidas[idPartida];
      io.emit('partidasActualizadas', JSON.parse(JSON.stringify(sanitizePartidas(partidas))));
      console.log('Partida cancelada:', idPartida);
    }
  });

  // Desconectar usuario
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
    delete usuarios[socket.id];
  });
});

// Función para eliminar propiedades circulares
function sanitizePartidas(partidas) {
  const sanitizedPartidas = {};
  for (const id in partidas) {
    sanitizedPartidas[id] = { ...partidas[id] };
    delete sanitizedPartidas[id].timeout;
  }
  return sanitizedPartidas;
}

// Definir la ruta principal
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

// Iniciar el servidor
server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});