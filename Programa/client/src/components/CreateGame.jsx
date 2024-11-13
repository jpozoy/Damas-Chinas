import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../styles/CreateGame.css';

const socket = io('/');

function CreateGame() {
  const [nickname, setNickname] = useState('');
  const [players, setPlayers] = useState(2);
  const [tablero, setTablero] = useState([]);
  const [selectedI, setSelectedI] = useState(null);
  const [selectedJ, setSelectedJ] = useState(null);
  const [jugadorActual, setJugadorActual] = useState(null);
  const [movimientosPosibles, setMovimientosPosibles] = useState([]);

  useEffect(() => {
    // Escuchar el evento 'tablero' del socket
    socket.on('tablero', (data) => {
      setTablero(data);
    });

    // Escuchar el evento 'jugadorActual' del socket
    socket.on('jugadorActual', (data) => {
      setJugadorActual(data);
    });

    // Escuchar el evento 'movimientosPosibles' del socket
    socket.on('movimientosPosibles', (data) => {
      setMovimientosPosibles(data);
    });

    // Limpiar los eventos al desmontar el componente
    return () => {
      socket.off('tablero');
      socket.off('jugadorActual');
      socket.off('movimientosPosibles');
    };
  }, []);

  const handleCreateGame = (e) => {
    e.preventDefault();
    // Lógica para crear una nueva partida
    console.log('Crear partida:', { nickname, players });
  };

  const handleCellClick = (i, j) => {
    setSelectedI(i);
    setSelectedJ(j);
    socket.emit('obtenerMovimientos', { coordInicial: [i, j] });
  };

  const handleMove = (i, j) => {
    if (movimientosPosibles.some(mov => mov[0] === i && mov[1] === j)) {
      socket.emit('moverFicha', {
        jugador: jugadorActual,
        coordInicial: [selectedI, selectedJ],
        posicionDestino: [i, j]
      });
      setSelectedI(null);
      setSelectedJ(null);
      setMovimientosPosibles([]);
    } else {
      console.log('Movimiento inválido');
    }
  };

  return (
    <div>
      <h2>Crear Partida</h2>

      <div className="tablero">
        {tablero.map((fila, i) => (
          <div key={i} className="fila">
            {fila.map((celda, j) => (
              <div
                key={j}
                className={`celda celda-${celda} ${movimientosPosibles.some(mov => mov[0] === i && mov[1] === j) ? 'movimiento-posible' : ''}`}
                onClick={() => (selectedI !== null && selectedJ !== null ? handleMove(i, j) : handleCellClick(i, j))}
              >
                {celda !== '_' && celda}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        <label>
          Coordenada I:
          <input type="text" value={selectedI !== null ? selectedI : ''} readOnly />
        </label>
        <label>
          Coordenada J:
          <input type="text" value={selectedJ !== null ? selectedJ : ''} readOnly />
        </label>
      </div>
      <div>
        <h3>Jugador Actual: {jugadorActual ? jugadorActual.nickname : 'N/A'}</h3>
      </div>
    </div>
  );
}

export default CreateGame;