//Clase de la logica del juego
class Juego { 
    //Constructor de la clase $ de momento solo datos básicos
    constructor(id, numJugadores, modoJuego) {
        this.id = id;
        this.numJugadores = numJugadores;
        this.modoJuego = modoJuego;
        this.jugadores = [];
        this.areaJuego;
        this.setAreaJuego(numJugadores);
    }

    //Definir desplazamientos para cada posición
    static desplazamientos = {
      1: { dx: 0, dy: -1 },
      2: { dxPar: -1, dyPar: 0, dxImpar: -1, dyImpar: -1 },
      3: { dxPar: -1, dyPar: 1, dxImpar: -1, dyImpar: 0 },
      4: { dx: 0, dy: 1 },
      5: { dxPar: 1, dyPar: 1, dxImpar: 1, dyImpar: 0 },
      6: { dxPar: 1, dyPar: 0, dxImpar: 1, dyImpar: -1 }
    };

    static posicionesPartida = {
      1: [
        { i: 0, j: 6 }, { i: 1, j: 6 }, { i: 1, j: 7 }, { i: 2, j: 5 }, { i: 2, j: 6 }, 
        { i: 2, j: 7 }, { i: 3, j: 5 }, { i: 3, j: 6 }, { i: 3, j: 7 }, { i: 3, j: 8 }
      ],
      2: [
        { i: 4, j: 9 }, { i: 4, j: 10 }, { i: 4, j: 11 }, { i: 4, j: 12 }, { i: 5, j: 10 }, 
        { i: 5, j: 11 }, { i: 5, j: 12 }, { i: 6, j:10  }, { i: 6, j: 11 }, { i: 7, j: 11 }
      ],
      3: [
        { i: 9, j: 11 }, { i: 10, j: 10 }, { i: 10, j: 11 }, { i: 11, j: 10 }, { i: 11, j: 11 }, 
        { i: 11, j: 12 }, { i: 12, j: 9 }, { i: 12, j: 10 }, { i: 12, j: 11 }, { i: 12, j: 12 }
      ],
      4: [
        { i: 13, j: 5 }, { i: 13, j: 6 }, { i: 13, j: 7 }, { i: 13, j: 8 }, { i: 14, j: 5 }, 
        { i: 14, j: 6 }, { i: 14, j: 7 }, { i: 15, j: 6 }, { i: 15, j: 7 }, { i: 16, j: 6 }
      ],
      5: [
        { i: 9, j: 2 }, { i: 10, j: 1 }, { i: 10, j: 2 }, { i: 11, j: 1 }, { i: 11, j: 2 }, 
        { i: 11, j: 3 }, { i: 12, j: 0 }, { i: 12, j: 1 }, { i: 12, j: 2 }, { i: 12, j: 3 }
      ],
      6: [
        { i: 4, j: 0 }, { i: 4, j: 1 }, { i: 4, j: 2 }, { i: 4, j: 3 }, { i: 5, j: 1 }, 
        { i: 5, j: 2 }, { i: 5, j: 3 }, { i: 6, j: 1 }, { i: 6, j: 2 }, { i: 7, j: 2 }
      ]
    };

    // Desplazamientos específicos para cada posición de salto
    static desplazamientosSaltos = {
      1: { dx: 0, dy: -2 },
      2: { dx: -2, dy: -1 },
      3: { dx: -2, dy: 1 },
      4: { dx: 0, dy: 2 },
      5: { dx: 2, dy: 1 },
      6: { dx: 2, dy: -1 }
    };

    // Set area de juego
    setAreaJuego(numJugadores) {
        switch (numJugadores) {
            case 2:
                this.areaJuego = [
                  ["_","_","_","_","_","_","1","_","_","_","_","_","_"], 
                ["_","_","_","_","_","_","1","1","_","_","_","_","_"], 
                  ["_","_","_","_","_","1","1","1","_","_","_","_","_"], 
                ["_","_","_","_","_","1","1","1","1","_","_","_","_"],
                  ["0","0","0","0","0","0","0","0","0","0","0","0","0"],
                ["_","0","0","0","0","0","0","0","0","0","0","0","0"], //17
                  ["_","0","0","0","0","0","0","0","0","0","0","0","_"],
                ["_","_","0","0","0","0","0","0","0","0","0","0","_"],
                  ["_","_","0","0","0","0","0","0","0","0","0","_","_"], // Mitad
                ["_","_","0","0","0","0","0","0","0","0","0","0","_"],
                  ["_","0","0","0","0","0","0","0","0","0","0","0","_"],
                ["_","0","0","0","0","0","0","0","0","0","0","0","0"],
                  ["0","0","0","0","0","0","0","0","0","0","0","0","0"],//17
                ["_","_","_","_","_","2","2","2","2","_","_","_","_"],
                  ["_","_","_","_","_","2","2","2","_","_","_","_","_"],
                ["_","_","_","_","_","_","2","2","_","_","_","_","_"],
                  ["_","_","_","_","_","_","2","_","_","_","_","_","_"]
            ];
                break;
            case 3:
              this.areaJuego = [
                ["_","_","_","_","_","_","0","_","_","_","_","_","_"], 
              ["_","_","_","_","_","_","0","0","_","_","_","_","_"], 
                ["_","_","_","_","_","0","0","0","_","_","_","_","_"], 
              ["_","_","_","_","_","0","0","0","0","_","_","_","_"],
                ["1","1","1","1","0","0","0","0","0","2","2","2","2"],
              ["_","1","1","1","0","0","0","0","0","0","2","2","2"], //17
                ["_","1","1","0","0","0","0","0","0","0","2","2","_"],
              ["_","_","1","0","0","0","0","0","0","0","0","2","_"],
                ["_","_","0","0","0","0","0","0","0","0","0","_","_"], // Mitad
              ["_","_","0","0","0","0","0","0","0","0","0","0","_"],
                ["_","0","0","0","0","0","0","0","0","0","0","0","_"],
              ["_","0","0","0","0","0","0","0","0","0","0","0","0"],
                ["0","0","0","0","0","0","0","0","0","0","0","0","0"],//17
              ["_","_","_","_","_","3","3","3","3","_","_","_","_"],
                ["_","_","_","_","_","3","3","3","_","_","_","_","_"],
              ["_","_","_","_","_","_","3","3","_","_","_","_","_"],
                ["_","_","_","_","_","_","3","_","_","_","_","_","_"]
          ];
                break;
            case 4:
                this.areaJuego = [
                  ["_","_","_","_","_","_","0","_","_","_","_","_","_"], 
                ["_","_","_","_","_","_","0","0","_","_","_","_","_"], 
                  ["_","_","_","_","_","0","0","0","_","_","_","_","_"], 
                ["_","_","_","_","_","0","0","0","0","_","_","_","_"],
                  ["1","1","1","1","0","0","0","0","0","2","2","2","2"],
                ["_","1","1","1","0","0","0","0","0","0","2","2","2"], //17
                  ["_","1","1","0","0","0","0","0","0","0","2","2","_"],
                ["_","_","1","0","0","0","0","0","0","0","0","2","_"],
                  ["_","_","0","0","0","0","0","0","0","0","0","_","_"], // Mitad
                ["_","_","4","0","0","0","0","0","0","0","0","3","_"],
                  ["_","4","4","0","0","0","0","0","0","0","3","3","_"],
                ["_","4","4","4","0","0","0","0","0","0","3","3","3"],
                  ["4","4","4","4","0","0","0","0","0","3","3","3","3"],//17
                ["_","_","_","_","_","0","0","0","0","_","_","_","_"],
                  ["_","_","_","_","_","0","0","0","_","_","_","_","_"],
                ["_","_","_","_","_","_","0","0","_","_","_","_","_"],
                  ["_","_","_","_","_","_","0","_","_","_","_","_","_"]
            ];
                break;
                case 6:
                this.areaJuego = [
                  ["_","_","_","_","_","_","1","_","_","_","_","_","_"], 
                ["_","_","_","_","_","_","1","1","_","_","_","_","_"], 
                  ["_","_","_","_","_","1","1","1","_","_","_","_","_"], 
                ["_","_","_","_","_","1","1","1","1","_","_","_","_"],
                  ["6","6","6","6","0","0","0","0","0","2","2","2","2"],
                ["_","6","6","6","0","0","0","0","0","0","2","2","2"], //17
                  ["_","6","6","0","0","0","0","0","0","0","2","2","_"],
                ["_","_","6","0","0","0","0","0","0","0","0","2","_"],
                  ["_","_","0","0","0","0","0","0","0","0","0","_","_"], // Mitad
                ["_","_","5","0","0","0","0","0","0","0","0","3","_"],
                  ["_","5","5","0","0","0","0","0","0","0","3","3","_"],
                ["_","5","5","5","0","0","0","0","0","0","3","3","3"],
                  ["5","5","5","5","0","0","0","0","0","3","3","3","3"],//17
                ["_","_","_","_","_","4","4","4","4","_","_","_","_"],
                  ["_","_","_","_","_","4","4","4","_","_","_","_","_"],
                ["_","_","_","_","_","_","4","4","_","_","_","_","_"],
                  ["_","_","_","_","_","_","4","_","_","_","_","_","_"]
            ];   
                break;
        }
    }
    // Movimiento genérico que unifica movPosicionX
    movimiento(coordenadaI, coordenadaJ, posicion) {
      const { dx, dy, dxPar, dyPar, dxImpar, dyImpar } = Juego.desplazamientos[posicion];
      const dxFinal = dx ?? (coordenadaI % 2 === 0 ? dxPar : dxImpar);
      const dyFinal = dy ?? (coordenadaI % 2 === 0 ? dyPar : dyImpar);
      const nuevaI = coordenadaI + dxFinal;
      const nuevaJ = coordenadaJ + dyFinal;

      if (this.esMovimientoValido(nuevaI, nuevaJ)) {
          return [nuevaI, nuevaJ];
      }
      return null;
    }

    esMovimientoValido(i, j) {
        return i >= 0 && i < this.areaJuego.length && j >= 0 && j < this.areaJuego[i].length;
    }

    // Buscar movimientos con todas las posiciones
    buscarMovimientos(coordenadaI, coordenadaJ) {
        const movimientos = [];
        for (let i = 1; i <= 6; i++) {
            const movimiento = this.movimiento(coordenadaI, coordenadaJ, i);
            if (movimiento) movimientos.push(movimiento);
        }
        return movimientos;
    }

    filtrarMovimientosValidos(movimientos) {
      return movimientos.filter(([i, j]) => this.areaJuego[i][j] == 0);
    }

    // Función de salto usando los desplazamientos específicos
    salto(coordenadaI, coordenadaJ, posicion) {
      const adyacente = this.movimiento(coordenadaI, coordenadaJ, posicion);
      if (!adyacente) return null;

      // Lista de fichas para verificar si hay una adyacente
      const fichas = ["1", "2", "3", "4", "5", "6"];

      const [adjI, adjJ] = adyacente;
      if (fichas.includes(this.areaJuego[adjI][adjJ])) {  // Verifica si hay una ficha adyacente
          // Usa el desplazamiento específico de salto para la posición
          const { dx, dy } = Juego.desplazamientosSaltos[posicion];
          const saltoI = coordenadaI + dx;
          const saltoJ = coordenadaJ + dy;
          if (this.esMovimientoValido(saltoI, saltoJ) && this.areaJuego[saltoI][saltoJ] == 0) {
              return [saltoI, saltoJ];
          }
      }
      return null;
    }

    // Buscar saltos disponibles para todas las posiciones
    buscarSaltos(coordenadaI, coordenadaJ) {
        const saltos = [];
        for (let i = 1; i <= 6; i++) {
            const salto = this.salto(coordenadaI, coordenadaJ, i);
            if (salto) saltos.push(salto);
        }
        return saltos;
    }
    
    // Función principal para obtener todos los saltos recursivos
    getSaltosRecursivos(coordenadaI, coordenadaJ) {
      let listaSaltos = [];
      let saltosIniciales = this.buscarSaltos(coordenadaI, coordenadaJ);
      
      // Recorrer cada salto inicial
      for (let salto of saltosIniciales) {
        this.explorarSaltos(
          salto[0],
          salto[1],
          [salto], // Comienza con el primer salto en la lista acumulada
          listaSaltos,
          new Set() // Usamos un conjunto vacío para las posiciones visitadas
        );
      }
      return listaSaltos;
    }

    // Función recursiva para explorar saltos sin límite de profundidad
    explorarSaltos(coordenadaI, coordenadaJ, saltosAcumulados, listaSaltos, visitados = new Set()) {
      const posicion = `${coordenadaI},${coordenadaJ}`;
      
      // Verificar si la posición ya fue visitada en esta cadena de saltos
      if (visitados.has(posicion)) return;
      
      // Agregar la posición actual a visitados
      visitados.add(posicion);
      
      // Obtener los saltos desde la posición actual
      let nuevosSaltos = this.filtrarSaltos(this.buscarSaltos(coordenadaI, coordenadaJ), visitados);
      
      // Si no hay más saltos posibles, agregamos el camino actual a listaSaltos
      if (nuevosSaltos.length === 0) {
        listaSaltos.push([...saltosAcumulados]);  // Guardamos una copia del camino actual
        return;
      }
    
      // Recursión para cada salto posible
      for (let salto of nuevosSaltos) {
        const saltoPosicion = `${salto[0]},${salto[1]}`;
        
        // Solo exploramos el salto si no ha sido visitado antes
        if (!visitados.has(saltoPosicion)) {
          this.explorarSaltos(
            salto[0], salto[1],
            [...saltosAcumulados, salto],  // Agregamos el salto actual a la cadena
            listaSaltos,
            new Set(visitados)  // Pasamos una copia del conjunto de visitados
          );
        }
      }
    }
    //Función para filtrar el salto por donde se vino
    filtrarSaltos(listaSaltos, setSaltos) {
      let listaFiltrada = [];
      for (let salto of listaSaltos) {
        let saltoSTR = `${salto[0]},${salto[1]}`;
        if (!setSaltos.has(saltoSTR)) {  // Verifica si el salto NO está en el set
          listaFiltrada.push(salto);
        }
      }
      return listaFiltrada;
    }

    obtenerMovimientosYsaltos(coordenadaI, coordenadaJ) {
      const movimientos = this.buscarMovimientos(coordenadaI, coordenadaJ);
      const movimientosValidos = this.filtrarMovimientosValidos(movimientos);
  
      const saltos = this.getSaltosRecursivos(coordenadaI, coordenadaJ);
  
      return {
        movimientosValidos,
        saltos
      };
    }

    //Función para mover una ficha, recibe la posición inicial y la posición destino
    moverFicha(coordInicial, posicionDestino) {
      const [coordI, coordJ] = coordInicial;
      const [destinoI, destinoJ] = posicionDestino;
      this.areaJuego[destinoI][destinoJ] = this.areaJuego[coordI][coordJ];
      this.areaJuego[coordI][coordJ] = 0;
    }

    //Verificar si hay un ganador
    verificarGanador(jugador) {
      const posicionesDestino = Juego.posicionesPartida[jugador];
      return posicionesDestino.every(({ i, j }) => this.areaJuego[x][y] === String(jugador));
    }
    

    //Funcion para crear cambios en el tablero
    testBoard() {
      this.areaJuego = [
        ["_","_","_","_","_","_","1","_","_","_","_","_","_"], 
      ["_","_","_","_","_","_","0","1","_","_","_","_","_"], 
        ["_","_","_","_","_","1","1","1","_","_","_","_","_"], 
      ["_","_","_","_","_","0","0","1","1","_","_","_","_"],
        ["0","0","0","0","0","1","0","0","0","0","0","0","0"],
      ["_","0","0","0","0","0","1","0","0","0","0","0","0"], //17
        ["_","0","0","0","0","0","1","0","0","0","0","0","_"],
      ["_","_","0","0","0","0","0","0","0","0","0","0","_"],
        ["_","_","0","0","0","0","0","0","0","0","0","_","_"], // Mitad
      ["_","_","0","0","0","0","0","0","0","0","0","0","_"],
        ["_","0","0","0","0","0","0","2","0","0","0","0","_"],
      ["_","0","0","0","0","0","0","0","0","0","0","0","0"],
        ["0","0","0","0","0","0","0","2","1","0","0","0","0"],//17
      ["_","_","_","_","_","2","0","0","0","_","_","_","_"],
        ["_","_","_","_","_","2","2","2","_","_","_","_","_"],
      ["_","_","_","_","_","_","2","2","_","_","_","_","_"],
        ["_","_","_","_","_","_","2","_","_","_","_","_","_"]
      ];
    }
    imprimirTablero() {
      for (let fila of this.areaJuego) {
        console.log(fila.join(' '));
      }
    }
    

}

export default Juego;
