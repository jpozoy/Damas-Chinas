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
  const [movimientosPosibles, setMovimientosPosibles] = useState([]);
  const [esMiTurno, setEsMiTurno] = useState(false);
  const [origenSeleccionado, setOrigenSeleccionado] = useState(null);

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

    const intervaloTurno = setInterval(() => {
      verificarTurno();
    }, 500); // Verificar cada 500 ms

    // Configuración del intervalo para obtener jugadores y tablero
    const intervalo = setInterval(() => {
      // Emitir el evento 'obtenerJugadores' y manejar la respuesta
      socket.emit('obtenerJugadores', idPartida, (data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          setJugadores(data.jugadores);
        }
      });

      // Emitir el evento 'obtenerTablero' de forma periódica
      socket.emit('obtenerTablero', idPartida, (data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          setTablero(data.tablero);
        }
      });

      // Verificar si la partida está completa
      // verificarPartidaCompleta();
    }, 500);  // Intervalo de 500ms

    // Limpiar cuando el componente se desmonte
    return () => {
      clearInterval(intervalo);  // Detener el intervalo
      clearInterval(intervaloTurno); // Detener el intervalo de turno
      socket.off('jugadoresActualizados');
      socket.off('tableroActualizado');
      socket.off('turnoActualizado');
      socket.off('partidaCompleta');
    };
  }, [idPartida, location, nickname]);

  const verificarTurno = () => {
    // Emitir la solicitud para verificar si es el turno del jugador
    socket.emit('verificarTurno', { idPartida, nickname }, (data) => {
      if (data.error) {
        console.error(data.error);
      } else {
        setEsMiTurno(data.turno);
      }
    });
  };

  const handleMovimiento = (coordenadaFinal) => {
    if (origenSeleccionado) {
      console.log('Moviendo ficha...',coordenadaFinal);
      socket.emit('moverFicha', { idPartida, coordenadaInicial: origenSeleccionado, coordenadaFinal});
      setOrigenSeleccionado(null); // Resetear origen después del movimiento
    }
  };
  const handleObtenerMovimientos = (coordenadaInicial) => {
    socket.emit('obtenerMovimientosPosibles', { idPartida, coordenadaInicial }, (data) => {
        if (data.error) {
            console.error(data.error);
        } else {
            console.log('Movimientos posibles recibidos:', data.movimientos);

            const movimientosValidos = data.movimientos.movimientosValidos;
            const saltos = data.movimientos.saltos;

            // Combinar movimientos válidos y saltos correctamente
            const casillasResaltadas = [
                ...movimientosValidos,
                ...saltos.flatMap((salto) => salto), // Aplanar solo una vez
            ];

            setMovimientosPosibles(casillasResaltadas);
        }
    });
};

  const esMovimientoPosible = (fila, columna) => {
    return movimientosPosibles.some(
      ([movFila, movColumna]) => movFila === fila && movColumna === columna
    );
  };
  
  const getCeldaClass = (celda, fila, columna) => {
    let baseClass = '';
    switch (celda) {
      case '0':
        baseClass = 'bg-white';
        break;
      case '1':
        baseClass = 'bg-red-500';
        break;
      case '2':
        baseClass = 'bg-blue-500';
        break;
      case '3':
        baseClass = 'bg-green-500';
        break;
      case '4':
        baseClass = 'bg-yellow-500';
        break;
      case '5':
        baseClass = 'bg-purple-500';
        break;
      case '6':
        baseClass = 'bg-orange-500';
        break;
      case '_':
        baseClass = 'invisible';
        break;
      default:
        break;
    }
  
    // Añade una clase adicional si es un movimiento posible
    if (esMovimientoPosible(fila, columna)) {
      baseClass += ' border-4 border-green-500';
    }
  
    return baseClass;
  };

  

  const getJugadorColor = (index) => {
    const colores = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-orange-500'];
    return colores[index % colores.length];
  };

  const esFichaDelJugador = (celda) => {
    const jugadorIndex = jugadores.findIndex(jugador => jugador.nickname === nickname) + 1;
    return celda === jugadorIndex.toString();
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
              <div key={i} className={`flex ${i % 2 === 0 ? 'ml-8' : ''}`}>
                {fila.map((celda, j) => (
                  <button
                  key={`${i}-${j}`}
                  className={`relative w-8 h-8 flex items-center justify-center rounded-full border border-black ${getCeldaClass(celda, i, j)}`}
                  onClick={() => {
                    if (esMovimientoPosible(i, j)) {
                      handleMovimiento([i, j]);
                    } else if (celda !== '_') {
                      setOrigenSeleccionado([i, j]);
                      handleObtenerMovimientos([i, j]);
                    }
                  }}
                  disabled={!esMiTurno || (!esFichaDelJugador(celda) && !esMovimientoPosible(i, j))}
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
            <div key={index} className={`p-4 rounded-lg shadow-lg ${turnoActual === index ? getJugadorColor(index) : 'bg-white'}`}>
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