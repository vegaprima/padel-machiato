import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TournamentPage from './pages/TournamentPage';
import PlayersPage from './pages/PlayersPage';
import MatchesPage from './pages/MatchesPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tournament" element={<TournamentPage />} />
      <Route path="/players" element={<PlayersPage />} />
      <Route path="/matches" element={<MatchesPage />} />
    </Routes>
  );
}

export default App;