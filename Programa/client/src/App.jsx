import React from 'react';
import { unstable_HistoryRouter as HistoryRouter, Routes, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Home from './components/Home';
import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import Ranking from './components/Ranking';
import WaitingRoom from './components/WaitingRoom';
import Game from './components/Game';

// Crear el historial del navegador con las banderas futuras
const history = createBrowserHistory({
  v7_startTransition: true,
  v7_relativeSplatPath: true
});

function App() {
  return (
    <HistoryRouter history={history}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-game" element={<CreateGame />} />
        <Route path="/join-game" element={<JoinGame />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/waiting-room/:idPartida" element={<WaitingRoom />} />
        <Route path="/game/:idPartida" element={<Game />} />
      </Routes>
    </HistoryRouter>
  );
}

export default App;