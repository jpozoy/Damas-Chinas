import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Damas Chinas</h1>
      <nav>
        <ul>
          <li><Link to="/create-game">Crear Partida</Link></li>
          <li><Link to="/join-game">Unirse a Juego</Link></li>
          <li><Link to="/ranking">Ver Ranking</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;