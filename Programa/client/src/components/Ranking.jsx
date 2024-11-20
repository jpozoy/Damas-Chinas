import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Ranking() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const nickname = params.get('nickname');
  const avatar = params.get('avatar');

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
          <h2 className="text-4xl font-bold">Ranking</h2>
          <p className="text-lg text-gray-500 mt-2">Funcionalidad de ranking aún no implementada.</p>
        </div>
      </div>
    </div>
  );
}

export default Ranking;