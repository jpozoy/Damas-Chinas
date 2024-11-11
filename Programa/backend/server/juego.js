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
    //Funcion para buscar movimientos posibles
    buscarMovimientos(coordenadaI, coordenadaJ, jugador) {
        let movimientos = [];
        let areaJuego = this.areaJuego;
        //Llamado a las funciones auxiliares para buscar movimientos
        //Posición 1
        this.movPosicion1(coordenadaI, coordenadaJ, movimientos);
        //Posición 2
        this.movPosicion2(coordenadaI, coordenadaJ, movimientos);
        //Posición 3
        this.movPosicion3(coordenadaI, coordenadaJ, movimientos);
        //Posición 4
        this.movPosicion4(coordenadaI, coordenadaJ, movimientos);
        //Posición 5
        this.movPosicion5(coordenadaI, coordenadaJ, movimientos);
        //Posición 6
        this.movPosicion6(coordenadaI, coordenadaJ, movimientos);
        console.log(movimientos);
        return movimientos;

    }
    //Funciones auxiliares para buscar movimientos especificos en las posiciones adyacentes
    //Posición 1
    movPosicion1(coordenadaI, coordenadaJ) { 
      let areaJuego = this.areaJuego;
      if (areaJuego[coordenadaI][coordenadaJ - 1] <= 6) {
        return true;
      }
    }
    //Posición 2
    movPosicion2(coordenadaI, coordenadaJ, listaMovimientos) { 
      let areaJuego = this.areaJuego;
      //Identificar si es par o impar
      switch(coordenadaI % 2) {
        //Par
        case 0:
          if (areaJuego[coordenadaI - 1][coordenadaJ] == 0) {
            listaMovimientos.push([coordenadaI - 1, coordenadaJ]);
          }
          break;
        //Impar          
        case 1:
          if (areaJuego[coordenadaI - 1][coordenadaJ - 1] == 0) {
            listaMovimientos.push([coordenadaI - 1, coordenadaJ - 1]);
          } 
          break;
      }
    }
    //Posición 3
    movPosicion3(coordenadaI, coordenadaJ, listaMovimientos) { 
      let areaJuego = this.areaJuego;
      //Identificar si es par o impar
      switch(coordenadaI % 2) {
        //Par
        case 0:
          if (areaJuego[coordenadaI - 1][coordenadaJ + 1] == 0) {
            listaMovimientos.push([coordenadaI - 1, coordenadaJ + 1]);
          }
          break;
        //Impar          
        case 1:
          if (areaJuego[coordenadaI - 1][coordenadaJ] == 0) {
            listaMovimientos.push([coordenadaI - 1, coordenadaJ]);
          }
          break;
      }
    }
    //Posición 4
    movPosicion4(coordenadaI, coordenadaJ, listaMovimientos) { 
      let areaJuego = this.areaJuego;
      if (areaJuego[coordenadaI][coordenadaJ + 1] == 0) {
        listaMovimientos.push([coordenadaI, coordenadaJ + 1]);
      }
    }
    //Posición 5
    movPosicion5(coordenadaI, coordenadaJ, listaMovimientos) { 
      let areaJuego = this.areaJuego;
      //Identificar si es par o impar
      switch(coordenadaI % 2) {
        //Par
        case 0:
          if (areaJuego[coordenadaI + 1][coordenadaJ + 1] == 0) {
            listaMovimientos.push([coordenadaI + 1, coordenadaJ + 1]);
          }
          break;
        //Impar          
        case 1:
          if (areaJuego[coordenadaI + 1][coordenadaJ] == 0) {
            listaMovimientos.push([coordenadaI + 1, coordenadaJ]);
          }
          break;
      }
    }
    //Posición 6
    movPosicion6(coordenadaI, coordenadaJ, listaMovimientos) { 
      let areaJuego = this.areaJuego;
      //Identificar si es par o impar
      switch(coordenadaI % 2) {
        //Par
        case 0:
          if (areaJuego[coordenadaI + 1][coordenadaJ] == 0) {
            listaMovimientos.push([coordenadaI + 1, coordenadaJ]);
          }
          break;
        //Impar          
        case 1:
          if (areaJuego[coordenadaI + 1][coordenadaJ - 1] == 0) {
            listaMovimientos.push([coordenadaI + 1, coordenadaJ - 1]);
          }
          break;
      }
    }
    //Funciones para buscar movimientos realizando saltos
    //--Verificar si hay fichas adyacentes
    //Posición 1
    movPosicion1(coordenadaI, coordenadaJ, listaMovimientos) { 
      let areaJuego = this.areaJuego;
      if (areaJuego[coordenadaI][coordenadaJ - 1] == 0) {
        listaMovimientos.push([coordenadaI, coordenadaJ - 1]);
      }
    }
    //Posición 2
    movPosicion2(coordenadaI, coordenadaJ, listaMovimientos) { 
      let areaJuego = this.areaJuego;
      //Identificar si es par o impar
      switch(coordenadaI % 2) {
        //Par
        case 0:
          if (areaJuego[coordenadaI - 1][coordenadaJ] == 0) {
            listaMovimientos.push([coordenadaI - 1, coordenadaJ]);
          }
          break;
        //Impar          
        case 1:
          if (areaJuego[coordenadaI - 1][coordenadaJ - 1] == 0) {
            listaMovimientos.push([coordenadaI - 1, coordenadaJ - 1]);
          } 
          break;
      }
    }
    //Posición 3
    movPosicion3(coordenadaI, coordenadaJ, listaMovimientos) { 
      let areaJuego = this.areaJuego;
      //Identificar si es par o impar
      switch(coordenadaI % 2) {
        //Par
        case 0:
          if (areaJuego[coordenadaI - 1][coordenadaJ + 1] == 0) {
            listaMovimientos.push([coordenadaI - 1, coordenadaJ + 1]);
          }
          break;
        //Impar          
        case 1:
          if (areaJuego[coordenadaI - 1][coordenadaJ] == 0) {
            listaMovimientos.push([coordenadaI - 1, coordenadaJ]);
          }
          break;
      }
    }
    //Posición 4
    movPosicion4(coordenadaI, coordenadaJ, listaMovimientos) { 
      let areaJuego = this.areaJuego;
      if (areaJuego[coordenadaI][coordenadaJ + 1] == 0) {
        listaMovimientos.push([coordenadaI, coordenadaJ + 1]);
      }
    }
    //Posición 5
    movPosicion5(coordenadaI, coordenadaJ, listaMovimientos) { 
      let areaJuego = this.areaJuego;
      //Identificar si es par o impar
      switch(coordenadaI % 2) {
        //Par
        case 0:
          if (areaJuego[coordenadaI + 1][coordenadaJ + 1] == 0) {
            listaMovimientos.push([coordenadaI + 1, coordenadaJ + 1]);
          }
          break;
        //Impar          
        case 1:
          if (areaJuego[coordenadaI + 1][coordenadaJ] == 0) {
            listaMovimientos.push([coordenadaI + 1, coordenadaJ]);
          }
          break;
      }
    }
    //Posición 6
    movPosicion6(coordenadaI, coordenadaJ, listaMovimientos) { 
      let areaJuego = this.areaJuego;
      //Identificar si es par o impar
      switch(coordenadaI % 2) {
        //Par
        case 0:
          if (areaJuego[coordenadaI + 1][coordenadaJ] == 0) {
            listaMovimientos.push([coordenadaI + 1, coordenadaJ]);
          }
          break;
        //Impar          
        case 1:
          if (areaJuego[coordenadaI + 1][coordenadaJ - 1] == 0) {
            listaMovimientos.push([coordenadaI + 1, coordenadaJ - 1]);
          }
          break;
      }
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
      console.log(listaSaltos);
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
        if(areaJuego[coordenadaI][coordenadaJ - 2] == 0) {
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
        if(areaJuego[coordenadaI][coordenadaJ - 2] == 0) {
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
        if(areaJuego[coordenadaI][coordenadaJ - 2] == 0) {
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
        if(areaJuego[coordenadaI][coordenadaJ - 2] == 0) {
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
      //Verificar si hay una ficha adayacente
      if(casillaAdyacente <= 6 && casillaAdyacente != 0) {
        if(areaJuego[coordenadaI][coordenadaJ - 2] == 0) {
          casillaSalto = [coordenadaI + 2, coordenadaJ - 1];
          return casillaSalto;
        }
      }
      return null;
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
}

export default Juego;
