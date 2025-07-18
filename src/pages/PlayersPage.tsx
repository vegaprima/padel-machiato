import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';

interface TournamentData {
  tournamentName: string;
  numberOfPeople: number;
  pointsToPlay: number;
}

function PlayersPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const tournamentData = location.state as TournamentData;
  
  const [playerNames, setPlayerNames] = useState<string[]>([]);

  useEffect(() => {
    if (!tournamentData) {
      navigate('/tournament');
      return;
    }
    // Initialize empty player names array
    setPlayerNames(new Array(tournamentData.numberOfPeople).fill(''));
  }, [tournamentData, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const updatedNames = [...playerNames];
    updatedNames[index] = name;
    setPlayerNames(updatedNames);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to matches page with all tournament data
    navigate('/matches', {
      state: {
        ...tournamentData,
        players: playerNames.filter(name => name.trim())
      }
    });
  };

  const isFormValid = playerNames.every(name => name.trim().length > 0);

  if (!tournamentData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <button 
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-medium text-gray-800">Add Players</h1>
        <div className="w-10"></div>
      </div>

      {/* Tournament Info */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <h2 className="text-sm font-medium text-gray-600 mb-1">{tournamentData.tournamentName}</h2>
        <p className="text-xs text-gray-500">
          {tournamentData.numberOfPeople} players • {tournamentData.pointsToPlay} points
        </p>
      </div>

      {/* Players Form */}
      <div className="px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {playerNames.map((name, index) => (
            <div key={index}>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                Player {index + 1}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                placeholder={`Enter player ${index + 1} name`}
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-lg"
              />
            </div>
          ))}

          {/* Submit Button */}
          <div className="pt-8">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-4 px-6 rounded-xl font-medium text-lg transition-all duration-200 ${
                isFormValid
                  ? 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Start Tournament
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlayersPage;