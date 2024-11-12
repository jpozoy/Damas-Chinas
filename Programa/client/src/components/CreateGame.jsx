import React, { useState } from 'react';

function CreateGame() {
  const [nickname, setNickname] = useState('');
  const [players, setPlayers] = useState(2);

  const handleCreateGame = () => {
    // Lógica para crear una nueva partida
    console.log('Crear partida:', { nickname, players });
  };

  return (
    <div>
      <h2>Crear Partida</h2>
      <form onSubmit={handleCreateGame}>
        <label>
          Nickname:
          <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
        </label>
        <label>
          Cantidad de Jugadores:
          <select value={players} onChange={(e) => setPlayers(e.target.value)}>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={6}>6</option>
          </select>
        </label>
        <button type="submit">Crear</button>
      </form>
    </div>
  );
}

export default CreateGame;