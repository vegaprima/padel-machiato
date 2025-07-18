import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TournamentPage from './pages/TournamentPage';
import PlayersPage from './pages/PlayersPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tournament" element={<TournamentPage />} />
      <Route path="/players" element={<PlayersPage />} />
    </Routes>
  );
}

export default App;