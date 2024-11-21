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
    return <div>Cargando...</div>;
  }

  return (
    <div className="h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('https://e1.pxfuel.com/desktop-wallpaper/123/676/desktop-wallpaper-new-version-of-agar-io-agario.jpg')" }}>
      {/* Contenedor Principal */}
      <div className="flex flex-col items-center justify-center h-full space-y-8 bg-gray-900/60 text-white">
        
        {/* Título */}
        <div className="bg-gray-100 rounded-lg p-8 w-3/4 shadow-lg text-center text-black">
          <h2 className="text-4xl font-bold mb-4">Estadísticas de la Partida</h2>
          <p className="text-xl font-semibold">ID de la Partida: {partida.idPartida}</p>
          <p className="text-xl font-semibold">Creador: {partida.creador}</p>
          <p className="text-xl font-semibold">Ganador: {partida.ganador}</p>
        </div>

        {/* Lista de Jugadores */}
        <div className="bg-gray-100 rounded-lg p-8 w-3/4 shadow-lg text-center text-black">
          <h3 className="text-2xl font-bold mb-4">Participantes</h3>
          <ul className="space-y-4">
            {partida.jugadores.map((jugador, index) => (
              <li key={index} className="flex items-center space-x-4 justify-center">
                <img src={jugador.avatar} alt="avatar" className="w-12 h-12 rounded-full border-2" />
                <span className="text-lg font-medium">{jugador.nickname}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Botón de Regresar */}
        <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-lg">
          Regresar al Menú
        </Link>
      </div>
    </div>
  );
}

export default Stats;
