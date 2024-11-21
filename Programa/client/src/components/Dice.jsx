import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('/');

function Dice() {
  const { idPartida } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const nickname = params.get('nickname');
  const avatar = params.get('avatar');
  const [jugadores, setJugadores] = useState([]);
  const [turnoActual, setTurnoActual] = useState(0);
  const [dados, setDados] = useState([0, 0]);
  const [ordenJugadores, setOrdenJugadores] = useState([]);
  const [contador, setContador] = useState(3);
  const [mostrarOrden, setMostrarOrden] = useState(false);

  useEffect(() => {
    socket.emit('obtenerJugadores', idPartida, (data) => {
      if (data.error) {
        console.error(data.error);
      } else {
        setJugadores(data.jugadores);
      }
    });

    const intervalo = setInterval(() => {
      socket.emit('obtenerTurno', idPartida, (data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          setTurnoActual(data.turnoActual);
          setDados(data.dados || [0, 0]);
          setContador(3);
        }
      });

      socket.emit('obtenerOrdenJugadores', idPartida, (data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          setOrdenJugadores(data.ordenJugadores);
          if (data.ordenJugadores.every(jugador => jugador.resultado !== undefined)) {
            setMostrarOrden(true);
            navigate(`/game/${idPartida}?nickname=${nickname}&avatar=${avatar}`);
          }
        }
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [idPartida, navigate, nickname, avatar]);

  const getJugadorColor = (index) => {
    const colores = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-orange-500'];
    return colores[index % colores.length];
  };

  const tirarDados = () => {
    if (jugadores.length === 0) return;

    const dado1 = Math.floor(Math.random() * 6) + 1;
    const dado2 = Math.floor(Math.random() * 6) + 1;
    const nuevosDados = [dado1, dado2];
    setDados(nuevosDados);
    console.log('Resultado:', nuevosDados);
    const siguienteTurno = (turnoActual + 1) % jugadores.length;

    socket.emit('actualizarTurno', { idPartida, turnoActual: siguienteTurno, dados: nuevosDados });
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

        <div className="flex w-full justify-center items-start space-x-8">
          {/* Orden de Jugadores */}
          {mostrarOrden ? (
            <div className="bg-gray-100 rounded-lg p-8 w-1/4 shadow-lg text-center">
              <h2 className="text-4xl font-bold">Orden de Jugadores</h2>
              <ul className="text-lg text-gray-500 mt-2">
                {ordenJugadores.map((jugador, index) => (
                  <li key={index} className={getJugadorColor(index)}>{jugador.nickname}</li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              {/* Animación de Dados */}
              <div className="flex flex-col items-center bg-gray-100 rounded-lg p-8 w-1/3 shadow-lg text-center">
                <h2 className="text-4xl font-bold">Dados</h2>
                <div className="text-6xl mt-4">{dados && dados.length > 0 ? `[${dados[0]}] - [${dados[1]}]` : '[0] - [0]'}</div>
                {jugadores[turnoActual] && jugadores[turnoActual].nickname === nickname && (
                  <button onClick={tirarDados} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    Girar
                  </button>
                )}
              </div>

              {/* Jugadores */}
              <div className="flex flex-wrap justify-center gap-4">
                {jugadores.map((jugador, index) => (
                  <div key={index} className={`p-4 rounded-lg shadow-lg ${turnoActual === index ? getJugadorColor(index) : 'bg-white'}`}>
                    <img src={jugador.avatar} alt="avatar" className="w-16 h-16 rounded-full border-2" />
                    <span className="text-black font-bold text-xl">{jugador.nickname}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dice;