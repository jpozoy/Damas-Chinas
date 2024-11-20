import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('/');

function Game() {
  const { idPartida } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [jugadores, setJugadores] = useState([]);
  const [tablero, setTablero] = useState([]); // Inicializar como array vacío
  const [turnoActual, setTurnoActual] = useState(0);
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nicknameParam = params.get('nickname');
    const avatarParam = params.get('avatar');
    if (nicknameParam) {
      setNickname(nicknameParam);
      setAvatar(avatarParam);
    }

    console.log('Conectando al servidor de sockets...');
    socket.on('connect', () => {
      console.log('Conectado al servidor de sockets');
      socket.emit('unirsePartida', { idPartida, nickname });
    });

    socket.on('jugadoresActualizados', (data) => {
      console.log('Jugadores actualizados recibidos:', data);
      setJugadores(data.jugadores);
    });

    socket.on('tableroActualizado', (data) => {
      console.log('Tablero actualizado:', data);
      setTablero(data);
    });

    socket.on('turnoActualizado', (data) => {
      console.log('Turno actualizado:', data);
      setTurnoActual(data);
    });

    socket.on('partidaCompleta', (data) => {
      console.log('Partida completa recibida:', data);
      // Redirigir al área de juego cuando la partida esté completa
      console.log('Partida completa, redirigiendo al área de juego...');
    });

    return () => {
      socket.off('jugadoresActualizados');
      socket.off('tableroActualizado');
      socket.off('turnoActualizado');
      socket.off('partidaCompleta');
    };
  }, [idPartida, location, nickname]);

  const handleMovimiento = (coordenadaInicial, coordenadaFinal) => {
    socket.emit('moverFicha', { idPartida, coordenadaInicial, coordenadaFinal });
  };

  const getCeldaClass = (celda) => {
    switch (celda) {
      case '0':
        return 'bg-white';
      case '1':
        return 'bg-red-500';
      case '2':
        return 'bg-blue-500';
      case '3':
        return 'bg-green-500';
      case '4':
        return 'bg-yellow-500';
      case '5':
        return 'bg-purple-500';
      case '6':
        return 'bg-orange-500';
      case '_':
        return 'invisible';
      default:
        return '';
    }
  };

  return (
    <div className="h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('https://e1.pxfuel.com/desktop-wallpaper/123/676/desktop-wallpaper-new-version-of-agar-io-agario.jpg')" }}>
      {/* Contenedor Principal */}
      <div className="flex flex-col items-center justify-center h-full space-y-8 bg-gray-900/60 text-black">

        {/* Información del Usuario */}
        <div className="absolute top-8 right-12 flex items-center space-x-4 bg-white p-2 rounded-lg shadow-lg">
          <img src={avatar} alt="avatar" className="w-16 h-16 rounded-full border-2" />
          <span className="text-black font-bold text-xl">{nickname}</span>
        </div>

        {/* Botón de Regresar al Menú */}
        <button onClick={() => navigate('/')} className="absolute top-4 left-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Regresar al Menú
        </button>

        {/* Tablero de Juego */}
        <div className="bg-gray-100 rounded-lg p-8 w-11/12 md:w-2/3 shadow-lg text-center">
          <h2 className="text-4xl font-bold">Juego de Damas Chinas</h2>
          <div className="flex flex-col items-center mt-4">
            {tablero && tablero.map((fila, i) => (
              <div key={i} className="flex">
                {fila.map((celda, j) => (
                  <button
                    key={`${i}-${j}`}
                    className={`w-8 h-8 flex items-center justify-center border border-black ${getCeldaClass(celda)}`}
                    onClick={() => handleMovimiento([i, j], [i, j])}
                  >
                    {celda !== '_' && <span className="text-white">{celda}</span>}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Jugadores */}
        <div className="flex flex-wrap justify-center gap-4">
          {jugadores.map((jugador, index) => (
            <div key={index} className={`p-4 rounded-lg shadow-lg ${turnoActual === index ? 'bg-green-500' : 'bg-white'}`}>
              <img src={jugador.avatar} alt="avatar" className="w-16 h-16 rounded-full border-2" />
              <span className="text-black font-bold text-xl">{jugador.nickname}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Game;