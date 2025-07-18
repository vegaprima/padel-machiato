import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TournamentPage from './pages/TournamentPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tournament" element={<TournamentPage />} />
    </Routes>
  );
}

export default App;