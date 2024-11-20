import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('/');

function WaitingRoom() {
  const { idPartida } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [jugadores, setJugadores] = useState([]);
  const [creador, setCreador] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutos en segundos

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nicknameParam = params.get('nickname');
    const avatarParam = params.get('avatar');
    if (nicknameParam) {
      setNickname(nicknameParam);
      setAvatar(avatarParam);
    }

    socket.on('jugadoresActualizados', (data) => {
      setJugadores(data);
    });

    socket.on('partidaCompleta', (data) => {
      // Redirigir al área de juego cuando la partida esté completa
      console.log('Partida completa, redirigiendo al área de juego...');
    });

    // Obtener el creador de la partida
    socket.emit('obtenerCreador', idPartida, (data) => {
      setCreador(data.creador);
    });

    // Contador de espera
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      socket.off('jugadoresActualizados');
      socket.off('partidaCompleta');
      clearInterval(timer);
    };
  }, [idPartida, location]);

  const handleCancel = () => {
    socket.emit('cancelarPartida', idPartida);
    navigate('/');
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
        <Link to={`/?nickname=${nickname}&avatar=${avatar}`} className="absolute top-4 left-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Regresar al Menú
        </Link>

        {/* Logo Principal */}
        <div className="bg-gray-100 rounded-lg p-8 w-1/3 shadow-lg text-center">
          <h2 className="text-4xl font-bold">Sala de Espera</h2>
          <p className="text-lg text-gray-500 mt-2">Esperando a que se unan más jugadores...</p>
          <p className="text-lg text-gray-500 mt-2">Tiempo restante: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}</p>
          <ul className="mt-4">
            {jugadores.map((jugador, index) => (
              <li key={index} className="mb-2 p-2 bg-white rounded shadow">
                {jugador.nickname} <img src={jugador.avatar} alt="avatar" className="inline-block w-8 h-8 rounded-full ml-2" />
              </li>
            ))}
          </ul>
          {creador === nickname && (
            <button onClick={handleCancel} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded mt-4 w-full text-lg">
              Cancelar Partida
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default WaitingRoom;