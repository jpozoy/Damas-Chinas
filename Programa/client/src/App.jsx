import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import Ranking from './components/Ranking';
import WaitingRoom from './components/WaitingRoom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-game" element={<CreateGame />} />
        <Route path="/join-game" element={<JoinGame />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/waiting-room/:idPartida" element={<WaitingRoom />} />
      </Routes>
    </Router>
  );
}

export default App;