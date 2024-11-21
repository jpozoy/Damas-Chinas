import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('/');

function Stats() {
  const { idPartida } = useParams();
  const [partida, setPartida] = useState(null);

  useEffect(() => {
    socket.emit('obtenerInfoPartida', idPartida, (data) => {
      if (data.error) {
        console.error(data.error);
      } else {
        setPartida(data);
      }
    });
  }, [idPartida]);

  if (!partida) {
    return <div className="h-screen flex items-center justify-center text-white">Cargando...</div>;
  }

  return (
    <div
      className="h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('https://e1.pxfuel.com/desktop-wallpaper/123/676/desktop-wallpaper-new-version-of-agar-io-agario.jpg')" }}
    >
      {/* Contenedor Principal */}
      <div className="flex flex-col items-center justify-center h-full space-y-8 bg-gray-900/60 text-white">

        {/* Título */}
        <h2 className="text-4xl font-bold">Estadísticas de la Partida</h2>

        {/* Información Principal */}
        <div className="bg-gray-100 rounded-lg p-8 w-2/3 shadow-lg text-center text-black">
          <p className="text-2xl font-bold mb-4">ID de la Partida: {partida.idPartida}</p>
          <p className="text-xl mb-2">Creador: <span className="font-semibold">{partida.creador}</span></p>

          {/* Lista de Participantes */}
          <h3 className="text-2xl font-bold mb-4">Participantes</h3>
          <ul className="grid grid-cols-2 gap-4">
            {partida.jugadores.map((jugador, index) => (
              <li key={index} className="flex items-center bg-white p-4 rounded-lg shadow-md relative">
                <img
                  src={jugador.avatar}
                  alt="avatar"
                  className="w-12 h-12 rounded-full border-2 mr-4"
                />
                <span className="text-lg font-bold">{jugador.nickname}</span>

                {/* Badge de corona si es el ganador */}
                {jugador.nickname === partida.ganador && (
                  <img
                  src="https://cdn-icons-png.flaticon.com/512/3763/3763864.png"
                  alt="crown"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8"
                />
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Botón de Regreso */}
        <Link
          to="/"
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg"
        >
          Regresar al Home
        </Link>
      </div>
    </div>
  );
}

export default Stats;
