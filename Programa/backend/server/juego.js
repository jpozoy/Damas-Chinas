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
    buscarMovimientos2(coordenadaI, coordenadaJ) {
        const movimientos = [];
        for (let i = 1; i <= 6; i++) {
            const movimiento = this.movimiento(coordenadaI, coordenadaJ, i);
            if (movimiento) movimientos.push(movimiento);
        }
        return movimientos;
    }
    
    // Función principal para obtener todos los saltos recursivos
    getSaltosRecursivos(coordenadaI, coordenadaJ) {
      let listaSaltos = [];
      let saltosIniciales = this.getSaltos(coordenadaI, coordenadaJ);
      
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

      console.log("Lista de todas las rutas:", listaSaltos);
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
      let nuevosSaltos = this.filtrarSaltos(this.getSaltos(coordenadaI, coordenadaJ), visitados);

      console.log("Posicion:", posicion);
      console.log("Saltos disponibles:", nuevosSaltos);
      console.log("Visitados:", Array.from(visitados));
      
      // Si no hay más saltos posibles, agregamos el camino actual a listaSaltos
      if (nuevosSaltos.length === 0) {
        console.log("Ruta completa encontrada:", saltosAcumulados);
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
    
      console.log("Saltos acumulados:", saltosAcumulados);
    }
    //Función para filtrar el salto por donde se vino
    filtrarSaltos(listaSaltos, setSaltos) {
      console.log("Saltos sin filtrar:", listaSaltos);
      console.log("Saltos visitados:", Array.from(setSaltos));
      let listaFiltrada = [];
      for (let salto of listaSaltos) {
        let saltoSTR = `${salto[0]},${salto[1]}`;
        console.log("Salto:", salto);
        if (!setSaltos.has(saltoSTR)) {  // Verifica si el salto NO está en el set
          listaFiltrada.push(salto);
        }
      }
      console.log("Saltos filtrados:", listaFiltrada);
      return listaFiltrada;
    }

    // Funcion para obtener todos los saltos disponibles
    getSaltos(coordenadaI, coordenadaJ) {
      let listaSaltos = [];
      if (this.saltoPosicion1(coordenadaI, coordenadaJ) != null) {
        listaSaltos.push(this.saltoPosicion1(coordenadaI, coordenadaJ));
      }
      if (this.saltoPosicion2(coordenadaI, coordenadaJ) != null) {
        listaSaltos.push(this.saltoPosicion2(coordenadaI, coordenadaJ));
      }
      if (this.saltoPosicion3(coordenadaI, coordenadaJ) != null) {
        listaSaltos.push(this.saltoPosicion3(coordenadaI, coordenadaJ));
      }
      if (this.saltoPosicion4(coordenadaI, coordenadaJ) != null) {
        listaSaltos.push(this.saltoPosicion4(coordenadaI, coordenadaJ));
      }
      if (this.saltoPosicion5(coordenadaI, coordenadaJ) != null) {
        listaSaltos.push(this.saltoPosicion5(coordenadaI, coordenadaJ));
      }
      if (this.saltoPosicion6(coordenadaI, coordenadaJ)!= null) {
        listaSaltos.push(this.saltoPosicion6(coordenadaI, coordenadaJ));
      }
      return listaSaltos;
    }
    //Funciones para obtener saltos disponibles por cada posición
    //Posición 1
    saltoPosicion1(coordenadaI, coordenadaJ) {
      let areaJuego = this.areaJuego;
      let casillaSalto;
      let casillaAdyacente = this.getAdyacente1(coordenadaI, coordenadaJ);
      //Verificar si hay una ficha adayacente
      if(casillaAdyacente <= 6 && casillaAdyacente != 0) {
        if(areaJuego[coordenadaI][coordenadaJ - 2] == 0) {
          casillaSalto = [coordenadaI, coordenadaJ - 2];
          return casillaSalto;
        }
      }
      return null;
    }
    //Posición 2
    saltoPosicion2(coordenadaI, coordenadaJ) {
      let areaJuego = this.areaJuego;
      let casillaSalto;
      let casillaAdyacente = this.getAdyacente2(coordenadaI, coordenadaJ);
      //Verificar si hay una ficha adayacente
      if(casillaAdyacente <= 6 && casillaAdyacente != 0) {
        if(areaJuego[coordenadaI - 2][coordenadaJ - 1] == 0) {
          casillaSalto = [coordenadaI - 2, coordenadaJ - 1];
          return casillaSalto;
        }
      }
      return null;
    }
    //Posición 3
    saltoPosicion3(coordenadaI, coordenadaJ) {
      let areaJuego = this.areaJuego;
      let casillaSalto;
      let casillaAdyacente = this.getAdyacente3(coordenadaI, coordenadaJ);
      //Verificar si hay una ficha adayacente
      if(casillaAdyacente <= 6 && casillaAdyacente != 0) {
        if(areaJuego[coordenadaI - 2][coordenadaJ + 1] == 0) {
          casillaSalto = [coordenadaI - 2, coordenadaJ + 1];
          return casillaSalto;
        }
      }
      return null;
    }
    //Posición 4
    saltoPosicion4(coordenadaI, coordenadaJ) {
      let areaJuego = this.areaJuego;
      let casillaSalto;
      let casillaAdyacente = this.getAdyacente4(coordenadaI, coordenadaJ);
      //Verificar si hay una ficha adayacente
      if(casillaAdyacente <= 6 && casillaAdyacente != 0) {
        if(areaJuego[coordenadaI][coordenadaJ + 2] == 0) {
          casillaSalto = [coordenadaI, coordenadaJ + 2];
          return casillaSalto;
        }
      }
      return null;
    }
    //Posición 5
    saltoPosicion5(coordenadaI, coordenadaJ) {
      let areaJuego = this.areaJuego;
      let casillaSalto;
      let casillaAdyacente = this.getAdyacente5(coordenadaI, coordenadaJ);
      //Verificar si hay una ficha adayacente
      if(casillaAdyacente <= 6 && casillaAdyacente != 0) {
        if(areaJuego[coordenadaI + 2][coordenadaJ + 1] == 0) {
          casillaSalto = [coordenadaI + 2, coordenadaJ + 1];
          return casillaSalto;
        }
      }
      return null;
    }
    //Posición 6
    saltoPosicion6(coordenadaI, coordenadaJ) {
      let areaJuego = this.areaJuego;
      let casillaSalto;
      let casillaAdyacente = this.getAdyacente6(coordenadaI, coordenadaJ);
      //Verificación para no salirse de la matriz
      if(!this.checkMovSalto(coordenadaI, coordenadaJ)){
        return null;
      }
      //Verificar si hay una ficha adayacente
      if(casillaAdyacente <= 6 && casillaAdyacente != 0) {
        if(areaJuego[coordenadaI + 2][coordenadaJ - 1] == 0) {
          casillaSalto = [coordenadaI + 2, coordenadaJ - 1];
          return casillaSalto;
        }
      }
      return null;
    }
    checkMovSalto(coordenadaI, coordenadaJ) {
      // Listas de coordenadas prohibidas
      const coordenadasProhibidasI = [0, 1, 15, 16];
      const coordenadasProhibidasJ = [0, 1, 11, 12];
      
      // Verificar si coordenadaI o coordenadaJ están en las listas de prohibición
      if (coordenadasProhibidasI.includes(coordenadaI) || coordenadasProhibidasJ.includes(coordenadaJ)) {
        return false; // Movimiento ilegal
      }
      
      return true; // Movimiento legal
    }

    // Funciones para obtener casillas adyacentes

    // Casilla adyacente en posición 1
    getAdyacente1(coordenadaI, coordenadaJ){
      let areaJuego = this.areaJuego;
      let casilla;
      if (coordenadaJ != 0) {
        casilla = areaJuego[coordenadaI][coordenadaJ-1];
        return casilla;
      }
      return false;
    }
    // Casilla adyacente en posición 2
    getAdyacente2(coordenadaI,coordenadaJ) {
      let areaJuego = this.areaJuego;
      let casilla;
      //Identificar si es par o impar
      switch(coordenadaI % 2) {
        //Caso par
        case 0:
          casilla = areaJuego[coordenadaI - 1][coordenadaJ];
          return casilla;
        //Caso impar
        case 1:
          casilla = areaJuego[coordenadaI - 1][coordenadaJ - 1];
          return casilla; 
      }
      return false
    }
    // Casilla adyacente en posición 3
    getAdyacente3(coordenadaI,coordenadaJ) {
      let areaJuego = this.areaJuego;
      let casilla;
      //Identificar si es par o impar
      switch(coordenadaI % 2) {
        //Caso par
        case 0:
          casilla = areaJuego[coordenadaI - 1][coordenadaJ + 1];
          return casilla;
        //Caso impar
        case 1:
          casilla = areaJuego[coordenadaI - 1][coordenadaJ];
          return casilla; 
      }
      return false
    }
    // Casilla adyacente en posición 4
    getAdyacente4(coordenadaI, coordenadaJ){
      let areaJuego = this.areaJuego;
      let casilla;
      if (coordenadaJ != 12) {
        casilla = areaJuego[coordenadaI][coordenadaJ + 1];
        return casilla;
      }
      return false;
    }
    // Casilla adyacente en posición 5
    getAdyacente5(coordenadaI,coordenadaJ) {
      let areaJuego = this.areaJuego;
      let casilla;
      //Identificar si es par o impar
      switch(coordenadaI % 2) {
        //Caso par
        case 0:
          casilla = areaJuego[coordenadaI + 1][coordenadaJ + 1];
          return casilla;
        //Caso impar
        case 1:
          casilla = areaJuego[coordenadaI + 1][coordenadaJ];
          return casilla; 
      }
      return false
    }
    // Casilla adyacente en posición 6
    getAdyacente6(coordenadaI,coordenadaJ) {
      let areaJuego = this.areaJuego;
      let casilla;
      //Identificar si es par o impar
      switch(coordenadaI % 2) {
        //Caso par
        case 0:
          casilla = areaJuego[coordenadaI + 1][coordenadaJ];
          return casilla;
        //Caso impar
        case 1:
          casilla = areaJuego[coordenadaI + 1][coordenadaJ - 1];
          return casilla; 
      }
      return false
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

}

export default Juego;
