import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('/');

function CreateGame() {
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [tipoJuego, setTipoJuego] = useState('Vs');
  const [cantidadJugadores, setCantidadJugadores] = useState(2);
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
  }, [location]);

  const handleCreateGame = () => {
    console.log('Creando partida...');
    console.log('Nickname:', nickname);
    console.log('Avatar:', avatar);
    console.log('Tipo de Juego:', tipoJuego);
    console.log('Cantidad de Jugadores:', cantidadJugadores);

    socket.emit('autenticar', { nickname, avatar }); // Asegúrate de que el usuario esté autenticado
    socket.emit('crearPartida', { nickname, tipoJuego, cantidadJugadores });
    socket.on('partidaCreada', ({ idPartida }) => {
      console.log('Partida creada:', { idPartida });
      navigate(`/waiting-room/${idPartida}?nickname=${nickname}&avatar=${avatar}`);
    });
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
          <h2 className="text-4xl font-bold">Crear Partida</h2>
          <div className="mb-4">
            <label className="block mb-4 text-left">
              Tipo de Juego:
              <select
                value={tipoJuego}
                onChange={(e) => setTipoJuego(e.target.value)}
                className="mt-2 w-full p-3 rounded-md text-black border border-black focus:outline-none"
              >
                <option value="Vs">Vs</option>
              </select>
            </label>
            <label className="block mb-4 text-left">
              Cantidad de Jugadores:
              <select
                value={cantidadJugadores}
                onChange={(e) => setCantidadJugadores(e.target.value)}
                className="mt-2 w-full p-3 rounded-md text-black border border-black focus:outline-none"
              >
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={6}>6</option>
              </select>
            </label>
            <button onClick={handleCreateGame} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded mt-4 w-full text-lg">
              Crear Partida
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateGame;