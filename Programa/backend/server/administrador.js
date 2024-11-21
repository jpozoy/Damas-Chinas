import Juego from './juego.js';

class Administrador {
  constructor(id, numJugadores, modoJuego, tiempoLimite) {
    this.juego = new Juego(id, numJugadores, modoJuego);
    this.tiempoLimite = tiempoLimite; // tiempo en minutos para el modo vs tiempo
    this.jugadores = []; // lista de jugadores en la partida
    this.turnoActual = 0; // Índice del jugador actual
    this.ganador = null; // Jugador ganador
    this.tiempoRestante = tiempoLimite * 60; // tiempo en segundos
    this.intervaloTiempo = null; // manejador del intervalo para el tiempo
    this.iniciarTemporizador(); // Iniciar el temporizador al crear la partida
  }

  // Agregar jugadores al juego
  agregarJugador(jugador) {
    if (this.jugadores.length < this.juego.numJugadores) {
      this.jugadores.push(jugador);
      this.juego.jugadores.push(jugador); // Añade el jugador a la instancia de juego
      console.log(`Jugador ${jugador.nickname} añadido al juego con avatar ${jugador.avatar}.`);
      return true;
    } else {
      console.log("El juego ya está lleno.");
      return false;
    }
  }

  // Iniciar el juego
  iniciarJuego() {
    if (this.jugadores.length == this.juego.numJugadores) {
      console.log("Iniciando juego...");
      this.detenerTemporizador();
      this.juego.setAreaJuego(this.jugadores.length); // Método de prueba para inicializar o cargar el tablero
      this.juego.testBoard(); // Método de prueba para inicializar o cargar el tablero
    } else {
      console.log("No hay suficientes jugadores para comenzar.");
    }
  }

  // Iniciar el temporizador para el modo de juego con límite de tiempo
  iniciarTemporizador() {
    if (this.tiempoLimite > 0) {
      this.intervaloTiempo = setInterval(() => {
        this.tiempoRestante--;
        // console.log(`Tiempo restante: ${this.tiempoRestante} segundos`);

        // Emitir el tiempo restante a todos los jugadores
        this.jugadores.forEach(jugador => {
          const socket = global.io.sockets.sockets.get(jugador.socketId);
          if (socket) {
            socket.emit('tiempoActualizado', { tiempoRestante: this.tiempoRestante });
          }
        });

        if (this.tiempoRestante <= 0) {
          console.log("El tiempo ha terminado.");
          this.finalizarJuego();
        }
      }, 1000);
    }
  }

  // Detener el temporizador
  detenerTemporizador() {
    if (this.intervaloTiempo) {
      clearInterval(this.intervaloTiempo);
      this.intervaloTiempo = null;
    }
  }

  // Finalizar el juego
  finalizarJuego() {
    console.log("El juego ha terminado.");
    this.detenerTemporizador();
  
    if (this.jugadores.length < this.juego.numJugadores) {
      console.log("El tiempo ha terminado y el juego no ha comenzado. Eliminando la partida.");
      this.jugadores.forEach(jugador => {
        const socket = global.io.sockets.sockets.get(jugador.socketId);
        if (socket) {
          socket.emit('partidaCancelada', { mensaje: 'El tiempo ha terminado y el juego no ha comenzado.', nickname: jugador.nickname, avatar: jugador.avatar });
        }
      });
  
      if (global.partidas && global.partidas[this.juego.id]) {
        delete global.partidas[this.juego.id];
      } else {
        console.error("No se pudo eliminar la partida porque no se encontró en global.partidas.");
      }
    } else {
      this.mostrarResultados();
    }
  }

  // Mostrar los resultados de la partida
  mostrarResultados() {
    console.log("Resultados del juego:");
    // Aquí podrías implementar lógica para mostrar al ganador, etc.
    this.jugadores.forEach((jugador, index) => {
      console.log(`Jugador ${index + 1}: ${jugador.nickname}`);
    });
  }

  // Establecer el tablero del juego en la clase Juego
  establecerTablero(tablero) {
    this.juego.areaJuego = tablero;
    console.log("Tablero establecido para el juego.");
  }

  // Obtener el tablero actual del juego
  obtenerTablero() {
    return this.juego.areaJuego;
  }

  obtenerMovimientos(coordenadaInicial) {
    const [coordI, coordJ] = coordenadaInicial;
    return this.juego.obtenerMovimientosYsaltos(coordI, coordJ);
  }

  // Avanzar el indice de turno
  avanzarTurno() {
    this.turnoActual = (this.turnoActual + 1) % this.jugadores.length;

    global.io.to(this.juego.id).emit('turnoActualizado', { turnoActual: this.turnoActual });
   }

   verificarGanador() {
    if (this.juego.verificarGanador(this.turnoActual + 1)) {
      this.ganador = this.jugadores[this.turnoActual];
      console.log("El ganador es: ", this.ganador.nickname);
      return true;
    }
    return false;
  }

  // Mover una ficha
  moverFicha(socketId, coordInicial, posicionDestino) {
    const jugador = this.jugadores.find(j => j.socketId === socketId);
    if (!jugador) {
      console.log("Jugador no encontrado.");
      // return;
    }
  
    this.juego.moverFicha(coordInicial, posicionDestino);
    this.avanzarTurno();
  }
}

export default Administrador;