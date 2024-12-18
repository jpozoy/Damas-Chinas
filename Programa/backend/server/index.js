import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Administrador from './administrador.js';
import Juego from './juego.js';
import { copyFileSync, readFileSync } from 'fs'; 

const app = express();
const server = http.createServer(app);
const io = new Server(server);

global.io = io; // Hacer io global para que pueda ser usado en administrador.js

const PORT = 3000;

global.partidas = {}; // Almacenará las partidas activas

let usuarios = {}; // Almacenará los usuarios autenticados

app.get('/api/partidas', (req, res) => {
  try {
    const data = readFileSync('./public//partidas.json', 'utf8');
    const partidas = JSON.parse(data);
    res.json(partidas);
  } catch (error) {
    console.error('Error al leer el archivo JSON:', error);
    res.status(500).json({ error: 'Error al leer el archivo JSON' });
  }
});
;


io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  socket.on('autenticar', ({ nickname, avatar }) => {
    if (nickname && avatar) {
      usuarios[socket.id] = { nickname, avatar };
      socket.emit('autenticado', { success: true });
      console.log(`Usuario autenticado: ${nickname}`);
    } else {
      socket.emit('autenticado', { success: false });
    }
  });

  socket.on('crearPartida', ({ nickname, avatar, tipoJuego, cantidadJugadores }) => {
    const idPartida = `partida_${Date.now()}`;
    const nuevaPartida = new Administrador(idPartida, cantidadJugadores, tipoJuego, 3); 
    nuevaPartida.agregarJugador({ nickname, avatar: usuarios[socket.id].avatar, socketId: socket.id });
    partidas[idPartida] = nuevaPartida;

    socket.join(idPartida);
    io.to(idPartida).emit('partidaCreada', { idPartida });
    io.emit('partidasActualizadas', Object.values(partidas).map(partida => ({
      id: partida.juego.id,
      creador: partida.jugadores[0].nickname,
      jugadores: partida.jugadores,
      cantidadJugadores: partida.juego.numJugadores
    })));
  });

  socket.on('unirsePartida', ({ idPartida, nickname, avatar }) => {
    const partida = partidas[idPartida];
    if (partida && partida.agregarJugador({ nickname, avatar: usuarios[socket.id].avatar, socketId: socket.id })) {
      socket.join(idPartida);
      io.to(idPartida).emit('jugadoresActualizados', { jugadores: partida.jugadores });

      if (partida.jugadores.length == partida.juego.numJugadores) {
        partida.iniciarJuego();
        io.to(idPartida).emit('partidaCompleta', { idPartida });
      } else {
        io.to(idPartida).emit('jugadoresActualizados', { jugadores: partida.jugadores });
      }
    } else {
      socket.emit('error', 'No se pudo unir a la partida.');
    }
  });

  socket.on('moverFicha', ({ idPartida, coordenadaInicial, coordenadaFinal }) => {
    const partida = partidas[idPartida];
    if (partida) {
      partida.moverFicha(socket.id, coordenadaInicial, coordenadaFinal);
      io.to(idPartida).emit('tableroActualizado', partida.obtenerTablero());
    }
  });

  socket.on('solicitarPartidas', () => {
    const partidasDisponibles = Object.values(partidas).filter(partida => partida.jugadores.length < partida.juego.numJugadores);
    const partidasConInfo = partidasDisponibles.map(partida => ({
      id: partida.juego.id,
      creador: partida.jugadores[0].nickname,
      jugadores: partida.jugadores,
      cantidadJugadores: partida.juego.numJugadores
    }));
    socket.emit('partidasActualizadas', partidasConInfo);
  });

  socket.on('cancelarPartida', ({ idPartida }) => {
    const partida = partidas[idPartida];
    if (partida) {
      partida.finalizarJuego(); // Llamar al método finalizarJuego
      io.to(idPartida).emit('partidaCancelada', { idPartida });
      delete partidas[idPartida];
      io.emit('partidasActualizadas', Object.values(partidas).map(partida => ({
        id: partida.juego.id,
        creador: partida.jugadores[0].nickname,
        jugadores: partida.jugadores,
        cantidadJugadores: partida.juego.numJugadores
      })));
    }
  });

  socket.on('obtenerCreador', (idPartida, callback) => {
    const partida = partidas[idPartida];
    if (partida) {
      const creador = partida.jugadores[0].nickname;
      callback({ creador });
    } else {
      callback({ error: 'Partida no encontrada' });
    }
  });

  socket.on('obtenerJugadores', (idPartida, callback) => {
    const partida = partidas[idPartida];
    if (partida) {
      const jugadores = partida.jugadores;
      const cantidadJugadores = partida.juego.numJugadores;
      callback({ jugadores, cantidadJugadores });
    } else {
      callback({ error: 'Partida no encontrada' });
    }
  });

  socket.on('obtenerTiempoRestante', (idPartida, callback) => {
    const partida = partidas[idPartida];
    if (partida) {
      const tiempoRestante = partida.tiempoRestante;
      callback({ tiempoRestante });
    } else {
      callback({ error: 'Partida no encontrada' });
    }
  });

  socket.on('verificarPartidaCompleta', (idPartida, callback) => {
    const partida = partidas[idPartida];
    if (partida) {
      const partidaCompleta = partida.jugadores.length == partida.juego.numJugadores;
      callback({ partidaCompleta });
    } else {
      callback({ error: 'Partida no encontrada' });
    }
  });

  socket.on('obtenerTablero', (idPartida, callback) => {
    const partida = partidas[idPartida];
    if (partida) {
      const tablero = partida.obtenerTablero();
      callback({ tablero });
    } else {
      callback({ error: 'Partida no encontrada' });
    }
  });

  socket.on('verificarPartidaCancelada', (idPartida, callback) => {
    const partida = partidas[idPartida];
    if (!partida) {
      callback({ cancelada: true, mensaje: 'La partida ha sido cancelada.' });
    } else {
      callback({ cancelada: false });
    }
  });

  socket.on('obtenerMovimientosPosibles', ({ idPartida, coordenadaInicial }, callback) => {
    const partida = partidas[idPartida];
    if (partida) {
      const movimientos = partida.obtenerMovimientos(coordenadaInicial);
      callback({ movimientos });
    } else {
      callback({ error: 'Partida no encontrada' });
    }
  });

  // Escuchar el evento 'verificarTurno' desde el frontend
  socket.on('verificarTurno', ({ idPartida, nickname }, callback) => {
    const partida = partidas[idPartida];

    if (partida) {
      // Obtener el jugador actual en turno (puedes tener un índice o un objeto que haga referencia al jugador)
      const jugadorActual = partida.jugadores[partida.turnoActual];

      // Verificar si el jugador en turno es el que está haciendo la solicitud
      if (jugadorActual.nickname === nickname) {
        // Si es el turno del jugador, retornar true
        callback({ turno: true });
      } else {
        // Si no es el turno del jugador, retornar false
        callback({ turno: false });
      }
    } else {
      // Si no se encuentra la partida, retornar un error
      callback({ error: 'Partida no encontrada' });
    }
  });


  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
    delete usuarios[socket.id];
    // Aquí podrías manejar la lógica para cuando un jugador se desconecta
  });

  socket.on('actualizarOrdenJugadores', ({ idPartida, ordenJugadores }) => {
    const partida = partidas[idPartida];
    if (partida) {
      console.log('Orden de jugadores actualizada:', ordenJugadores);
      partida.jugadores = ordenJugadores;
      io.to(idPartida).emit('actualizarOrdenJugadores', { ordenJugadores });
    }
  });

  socket.on('actualizarTurno', ({ idPartida, turnoActual, dados }) => {
    const partida = partidas[idPartida];
    if (partida) {
      const jugadorActual = partida.jugadores[partida.turnoActual];
      jugadorActual.resultado = dados[0] + dados[1];
      partida.turnoActual = turnoActual;
      partida.dados = dados;

      if (turnoActual === 0) {
        partida.jugadores.sort((a, b) => {
          if (a.resultado === b.resultado) {
            return a.nickname.localeCompare(b.nickname);
          }
          return b.resultado - a.resultado;
        });
        io.to(idPartida).emit('actualizarOrdenJugadores', { ordenJugadores: partida.jugadores });
      }

      io.to(idPartida).emit('actualizarTurno', { turnoActual, dados });
    }
  });

  socket.on('obtenerTurno', (idPartida, callback) => {
    const partida = partidas[idPartida];
    if (partida) {
      callback({ turnoActual: partida.turnoActual, dados: partida.dados });
    } else {
      callback({ error: 'Partida no encontrada' });
    }
  });


  socket.on('obtenerOrdenJugadores', (idPartida, callback) => {
    const partida = partidas[idPartida];
    if (partida) {
      callback({ ordenJugadores: partida.jugadores });
    } else {
      callback({ error: 'Partida no encontrada' });
    }
  });

  socket.on('verificarEstadoPartida', (idPartida, callback) => {
    const partida = partidas[idPartida];
    if (partida) {
      callback(partida.ganador !== null);
    } else {
      callback(false);
    }
  });

  socket.on('obtenerInfoPartida', (idPartida, callback) => {
    const partida = partidas[idPartida];
    if (partida) {
      callback({
        idPartida: partida.juego.id,
        creador: partida.jugadores[0].nickname,
        ganador: partida.ganador ? partida.ganador.nickname : 'Aún no hay ganador',
        jugadores: partida.jugadores.map(jugador => ({
          nickname: jugador.nickname,
          avatar: jugador.avatar
        }))
      });
    } else {
      callback({ error: 'Partida no encontrada' });
    }
  });


});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});