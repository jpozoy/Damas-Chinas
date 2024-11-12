import express from 'express';
import logger from 'morgan';

import { Server} from 'socket.io';
import { createServer } from 'node:http';

import Juego from './juego.js';

const port = 3000;

//Inicializar express
const app = express();
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    
    const juego = new Juego(2, 6, "Normal");
    let movimiento = juego.buscarMovimientos(8,6);
    juego.testBoard();
    let saltos = juego.buscarSaltos(7,5);
    console.log(saltos);
    let movimientos = juego.getSaltosRecursivos(15,7);
    console.log('a user connected');
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