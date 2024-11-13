import express from 'express';
import logger from 'morgan';

import { Server} from 'socket.io';
import { createServer } from 'node:http';
import Administrador from './administrador.js';

import Juego from './juego.js';

const port = 3000;

//Inicializar express
const app = express();
const server = createServer(app);
const io = new Server(server);

// const administrador = new Administrador(1, 6, "Normal", 10); 

io.on('connection', (socket) => {
    

  const juego = new Juego(2, 6, "Normal");
  let movimiento = juego.buscarMovimientos(8,6);
  juego.testBoard();
  let saltos = juego.buscarSaltos(7,5);
  console.log(saltos);
  let movimientos = juego.getSaltosRecursivos(15,7);
  console.log('a user connected');

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
});

app.use(logger('dev'));

//Definir la ruta principal
app.get('/', (req, res) => {
  res.send('Hello World');
});

//Iniciar el servidor
server.listen(port, () => { 
  console.log(`Server running on port ${port}`);
});