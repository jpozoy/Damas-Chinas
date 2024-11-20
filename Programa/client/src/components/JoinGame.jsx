import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import io from 'socket.io-client';
import { FaSync } from 'react-icons/fa';

const socket = io('/');

function JoinGame() {
  const [partidas, setPartidas] = useState([]);
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nicknameParam = params.get('nickname');
    const avatarParam = params.get('avatar');
    if (nicknameParam) {
      setNickname(nicknameParam);
      setAvatar(avatarParam);
    }

    socket.on('partidasActualizadas', (data) => {
      console.log('Partidas actualizadas:', data);
      setPartidas(Object.values(data));
    });

    // Solicitar las partidas actuales al servidor
    socket.emit('solicitarPartidas');

    return () => {
      socket.off('partidasActualizadas');
    };
  }, [location]);

  const handleJoinGame = (idPartida) => {
    console.log('Intentando unirse a la partida:', idPartida, 'con nickname:', nickname);
    socket.emit('autenticar', { nickname, avatar }); // Asegúrate de que el usuario esté autenticado
    socket.emit('unirsePartida', { idPartida, nickname });
    navigate(`/waiting-room/${idPartida}?nickname=${nickname}&avatar=${avatar}`);
  };

  const handleRefresh = () => {
    window.location.reload();
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
          <h2 className="text-4xl font-bold">Unirse a Juego</h2>
          <div className="mb-4">
            <label className="block mb-4 text-left">
              Buscar partida:
              <input
                type="text"
                className="mt-2 w-full p-3 rounded-md text-black border border-black focus:outline-none"
              />
            </label>
          </div>
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-semibold">Partidas Disponibles</h3>
            <button onClick={handleRefresh} className="ml-2 text-blue-500 hover:text-blue-700">
              <FaSync size={20} />
            </button>
          </div>
          <div className="h-96 overflow-y-auto">
            <ul>
              {partidas.map((partida) => (
                <li key={partida.id} className="mb-2">
                  <div className="p-4 border rounded">
                    <p>Creador: {partida.creador}</p>
                    <p>Identificador: {partida.id}</p>
                    <p>Cupo: {partida.jugadores.length}/{partida.cantidadJugadores}</p>
                    <button onClick={() => handleJoinGame(partida.id)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-2">
                      Unirse
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinGame;