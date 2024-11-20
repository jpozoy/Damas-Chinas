import express from 'express';
import logger from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import { stringify, parse } from 'flatted';

const port = 3000;

// Inicializar express
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(logger('dev'));

// Estructura para almacenar partidas y usuarios
const partidas = {};
const usuarios = {};

// Función para obtener las partidas disponibles
const getAvailableGames = () => {
  return Object.values(partidas).filter(partida => partida.estado === 'esperando');
};

// Función para eliminar propiedades circulares usando Flatted
const sanitizePartida = (partida) => {
  const sanitizedPartida = parse(stringify(partida));
  delete sanitizedPartida.timeout; // Eliminar referencias no necesarias
  if (sanitizedPartida.tablero) {
    sanitizedPartida.tablero = sanitizedPartida.tablero.map(row => [...row]); // Clonar el tablero
  }
  return sanitizedPartida;
};

io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  // Enviar las partidas actuales al cliente recién conectado
  socket.emit('partidasActualizadas', getAvailableGames());

  // Manejar autenticación del usuario
  socket.on('autenticar', ({ nickname, avatar }) => {
    usuarios[socket.id] = { nickname, avatar };
    console.log(`Usuario autenticado: ${nickname}, idSocket: ${socket.id}`);
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
      turnoActual: 0,
      tablero: [] // Inicializar el tablero del juego
    };
    socket.join(idPartida);
    console.log(`Partida creada: ${idPartida}`);
    io.emit('partidasActualizadas', getAvailableGames());
    socket.emit('partidaCreada', { idPartida });

    // Iniciar contador de 3 minutos para cerrar la partida si no se completa
    partidas[idPartida].timeout = setTimeout(() => {
      if (partidas[idPartida] && partidas[idPartida].estado === 'esperando') {
        delete partidas[idPartida];
        io.emit('partidasActualizadas', getAvailableGames());
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
      partidas[idPartida].jugadores.push(jugador);
      socket.join(idPartida);
      const sanitizedPartida = sanitizePartida(partidas[idPartida]);
      io.to(idPartida).emit('jugadoresActualizados', sanitizedPartida);
      if (partidas[idPartida].jugadores.length === partidas[idPartida].cantidadJugadores) {
        partidas[idPartida].estado = 'completa';
        partidas[idPartida].tablero = inicializarTablero(partidas[idPartida].cantidadJugadores); // Inicializar el tablero del juego
        io.to(idPartida).emit('partidaCompleta', sanitizedPartida);
        io.to(idPartida).emit('tableroActualizado', partidas[idPartida].tablero);
        io.to(idPartida).emit('turnoActualizado', 0); // Iniciar con el primer jugador
      }
      io.emit('partidasActualizadas', getAvailableGames());
    } else {
      socket.emit('error', { message: 'Partida llena' });
    }
  });

  // Manejar movimiento de ficha
  socket.on('moverFicha', ({ idPartida, coordenadaInicial, coordenadaFinal }) => {
    const partida = partidas[idPartida];
    if (partida) {
      const jugador = partida.jugadores[partida.turnoActual];
      moverFicha(partida, jugador, coordenadaInicial, coordenadaFinal);
      io.to(idPartida).emit('tableroActualizado', partida.tablero);
      partida.turnoActual = (partida.turnoActual + 1) % partida.jugadores.length;
      io.to(idPartida).emit('turnoActualizado', partida.turnoActual);
    }
  });

  // Cancelar partida
  socket.on('cancelarPartida', (idPartida) => {
    console.log('Cancelando partida:', partidas[idPartida]);
    if (partidas[idPartida]) {
      clearTimeout(partidas[idPartida].timeout);
      const jugadores = partidas[idPartida].jugadores;
      delete partidas[idPartida];
      io.emit('partidasActualizadas', getAvailableGames());
      jugadores.forEach(jugador => {
        const socketId = Object.keys(usuarios).find(key => usuarios[key].nickname === jugador.nickname);
        if (socketId) {
          io.to(socketId).emit('partidaCancelada', { nickname: jugador.nickname, avatar: jugador.avatar });
        }
      });
    }
  });

  // Desconectar usuario
  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.id}`);
    delete usuarios[socket.id];
  });
});

// Función para inicializar el tablero del juego
const inicializarTablero = (cantidadJugadores) => {
  // Lógica para inicializar el tablero del juego según la cantidad de jugadores
  return [];
};

// Función para manejar el movimiento de ficha
const moverFicha = (partida, jugador, coordenadaInicial, coordenadaFinal) => {
  // Lógica para manejar el movimiento de ficha en el tablero
};

// Definir la ruta principal
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

// Iniciar el servidor
server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});