import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Administrador from './administrador.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

let partidas = {}; // Almacenará las partidas activas
let usuarios = {}; // Almacenará los usuarios autenticados

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

  socket.on('crearPartida', ({ nickname, tipoJuego, cantidadJugadores }) => {
    const idPartida = `partida_${Date.now()}`;
    const nuevaPartida = new Administrador(idPartida, cantidadJugadores, tipoJuego, 3); 
    nuevaPartida.agregarJugador({ nickname, socketId: socket.id });
    partidas[idPartida] = nuevaPartida;

    socket.join(idPartida);
    io.to(idPartida).emit('partidaCreada', { idPartida });
    io.emit('partidasActualizadas', partidas);
  });

  socket.on('unirsePartida', ({ idPartida, nickname }) => {
    const partida = partidas[idPartida];
    if (partida && partida.agregarJugador({ nickname, socketId: socket.id })) {
      socket.join(idPartida);
      io.to(idPartida).emit('jugadoresActualizados', { jugadores: partida.jugadores });

      if (partida.jugadores.length === partida.juego.numJugadores) {
        partida.iniciarJuego();
        io.emit('partidaCompleta', { idPartida });
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
      io.to(idPartida).emit('partidaCancelada', { idPartida });
      delete partidas[idPartida];
      io.emit('partidasActualizadas', partidas);
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

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
    delete usuarios[socket.id];
    // Aquí podrías manejar la lógica para cuando un jugador se desconecta
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});