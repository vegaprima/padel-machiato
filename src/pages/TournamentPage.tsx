import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Trophy, Target } from 'lucide-react';

function TournamentPage() {
  const navigate = useNavigate();
  const [tournamentName, setTournamentName] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('4');
  const [pointsToPlay, setPointsToPlay] = useState('16');

  const handleBack = () => {
    navigate('/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to players page with tournament data
    navigate('/players', {
      state: {
        tournamentName,
        numberOfPeople: parseInt(numberOfPeople),
        pointsToPlay: parseInt(pointsToPlay)
      }
    });
  };

  const isFormValid = tournamentName.trim() && 
                     parseInt(numberOfPeople) >= 4 && 
                     parseInt(pointsToPlay) > 0;

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
        <h1 className="text-lg font-medium text-gray-800">New Tournament</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {/* Form */}
      <div className="px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Tournament Name */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <Trophy className="w-4 h-4 mr-2 text-gray-500" />
              Tournament Name
            </label>
            <input
              type="text"
              value={tournamentName}
              onChange={(e) => setTournamentName(e.target.value)}
              placeholder="Enter tournament name"
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-lg"
            />
          </div>

          {/* Number of People */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <Users className="w-4 h-4 mr-2 text-gray-500" />
              Number of Players
            </label>
            <input
              type="number"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(e.target.value)}
              placeholder="Minimum 4 players"
              min="4"
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-lg"
            />
            <p className="text-xs text-gray-500 mt-2">Minimum 4 players required</p>
          </div>

          {/* Points to Play */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <Target className="w-4 h-4 mr-2 text-gray-500" />
              Points to Play
            </label>
            <select
              value={pointsToPlay}
              onChange={(e) => setPointsToPlay(e.target.value)}
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-lg"
            >
              <option value="16">16 points</option>
              <option value="21">21 points</option>
            </select>
          </div>

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
              Create Tournament
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TournamentPage;