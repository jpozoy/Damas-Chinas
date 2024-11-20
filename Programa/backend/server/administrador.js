// archivo administrador.js
import Juego from './juego.js';

class Administrador {
  constructor(id, numJugadores, modoJuego, tiempoLimite) {
    this.juego = new Juego(id, numJugadores, modoJuego);
    this.tiempoLimite = tiempoLimite; // tiempo en minutos para el modo vs tiempo
    this.jugadores = []; // lista de jugadores en la partida
    this.tiempoRestante = tiempoLimite * 60; // tiempo en segundos
    this.intervaloTiempo = null; // manejador del intervalo para el tiempo
  }

  // Agregar jugadores al juego
  agregarJugador(jugador) {
    if (this.jugadores.length < this.juego.numJugadores) {
      this.jugadores.push(jugador);
      this.juego.jugadores.push(jugador); // Añade el jugador a la instancia de juego
      console.log(`Jugador ${jugador.nickname} añadido al juego.`);
      return true;
    } else {
      console.log("El juego ya está lleno.");
      return false;
    }
  }

  // Iniciar el juego
  iniciarJuego() {
    if (this.jugadores.length === this.juego.numJugadores) {
      console.log("Iniciando juego...");
      this.iniciarTemporizador();
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
        console.log(`Tiempo restante: ${this.tiempoRestante} segundos`);

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
    this.mostrarResultados();
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

  // Mover una ficha
  moverFicha(jugador, coordInicial, posicionDestino) {
    const movimientos = this.juego.buscarMovimientos(coordInicial[0], coordInicial[1]);
    const saltos = this.juego.buscarSaltos(coordInicial[0], coordInicial[1]);

    // Verificar si el movimiento es válido en los movimientos o saltos
    const movimientoValido = movimientos.concat(saltos).some(
      (movimiento) => movimiento[0] === posicionDestino[0] && movimiento[1] === posicionDestino[1]
    );

    if (movimientoValido) {
      console.log(`Movimiento válido realizado por ${jugador.nickname} a la posición (${posicionDestino[0]}, ${posicionDestino[1]})`);
      // Actualiza el tablero en la clase Juego
      this.juego.areaJuego[coordInicial[0]][coordInicial[1]] = 0; // Limpia la posición inicial
      this.juego.areaJuego[posicionDestino[0]][posicionDestino[1]] = jugador.color; // Coloca la ficha del jugador en la nueva posición
    } else {
      console.log("Movimiento inválido.");
    }
  }
}

export default Administrador;