// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import AvatarSelector from '../services/AvatarSelector'; // Ruta al componente AvatarSelector

const socket = io('/');

function Home() {
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nicknameParam = params.get('nickname');
    const avatarParam = params.get('avatar');
    if (nicknameParam) {
      setNickname(nicknameParam);
      setAvatar(avatarParam);
      setIsAuthenticated(true);
    }
  }, [location]);

  const handleRegister = () => {
    if (!nickname || !avatar) {
      window.alert('Por favor, ingresa tu nombre y selecciona un avatar.');
      return;
    }
    socket.emit('autenticar', { nickname, avatar });
    socket.on('autenticado', (data) => {
      if (data.success) {
        setIsAuthenticated(true);
      }
    });
  };

  const handleLogout = () => {
    socket.emit('desconectar', nickname);
    setIsAuthenticated(false);
    setNickname('');
    setAvatar('');
  };

  const handleAvatarSelect = (selectedAvatar) => {
    setAvatar(selectedAvatar);
  };

  return (
    <div className="h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('https://e1.pxfuel.com/desktop-wallpaper/123/676/desktop-wallpaper-new-version-of-agar-io-agario.jpg')" }}>
      <div className="flex flex-col items-center justify-center h-full space-y-8 bg-gray-900/60 text-black">
        <div className={`bg-gray-100 rounded-lg p-8 w-11/12 md:w-1/3 shadow-lg text-center ${isAuthenticated ? 'bg-opacity-90' : ''}`}>
          <h1 className="text-4xl font-bold">Damiselas Chinas</h1>
          {!isAuthenticated && <p className="text-lg text-gray-500 mt-2">¡Ingresa tu nickname para poder jugar!</p>}
          {isAuthenticated ? (
            <>
              <p className="mt-4 text-xl font-semibold text-gray-700">Bienvenido, {nickname}!</p>
              <img src={avatar} alt="avatar" className="w-20 h-20 mx-auto my-4 rounded-full border-2" />
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded mt-4 w-full text-lg">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Tu nombre"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="mt-4 w-full p-3 rounded-md text-black border border-black focus:outline-none"
              />
              <p className="text-lg text-gray-500 mt-6 mb-4 text-left">¡Selecciona tu avatar!</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <AvatarSelector onAvatarSelect={handleAvatarSelect} />
              </div>
              <button
                onClick={handleRegister}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded mt-4 w-full text-lg"
              >
                Registrar
              </button>
            </>
          )}
        </div>
        {isAuthenticated && (
          <div className="bg-gray-100 rounded-lg p-8 w-11/12 md:w-1/3 shadow-lg bg-opacity-90">
            <h2 className="text-2xl font-bold text-center mb-4">Seleccionar para Iniciar</h2>
            <div className="grid grid-cols-3 gap-4">
              <Link to={`/create-game?nickname=${nickname}&avatar=${avatar}`} className="bg-green-500 p-4 rounded text-center text-white text-lg hover:bg-green-600">
                Crear partida
              </Link>
              <Link to={`/join-game?nickname=${nickname}&avatar=${avatar}`} className="bg-green-500 p-4 rounded text-center text-white text-lg hover:bg-green-600">
                Unirse a Juego
              </Link>
              <Link to={`/ranking?nickname=${nickname}&avatar=${avatar}`} className="bg-green-500 p-4 rounded text-center text-white text-lg hover:bg-green-600">
                Ver Ranking
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;