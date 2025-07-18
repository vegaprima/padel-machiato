import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Shuffle, Trophy } from 'lucide-react';

interface TournamentData {
  tournamentName: string;
  numberOfPeople: number;
  pointsToPlay: number;
  players: string[];
}

interface Team {
  players: string[];
}

interface Match {
  team1: Team;
  team2: Team;
}

function MatchesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const tournamentData = location.state as TournamentData;
  
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);

  useEffect(() => {
    if (!tournamentData || !tournamentData.players) {
      navigate('/players');
      return;
    }
    generateRandomMatch();
  }, [tournamentData, navigate]);

  const generateRandomMatch = () => {
    if (!tournamentData?.players || tournamentData.players.length < 4) return;

    // Shuffle players array
    const shuffledPlayers = [...tournamentData.players].sort(() => Math.random() - 0.5);
    
    // Select 4 random players
    const selectedPlayers = shuffledPlayers.slice(0, 4);
    
    // Divide into 2 teams
    const team1 = { players: [selectedPlayers[0], selectedPlayers[1]] };
    const team2 = { players: [selectedPlayers[2], selectedPlayers[3]] };
    
    setCurrentMatch({ team1, team2 });
  };

  const handleBack = () => {
    navigate('/players');
  };

  const handleLeaderboard = () => {
    // TODO: Navigate to leaderboard page
    console.log('Navigate to leaderboard');
  };

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
        <h1 className="text-lg font-medium text-gray-800">Current Match</h1>
        <div className="w-10"></div>
      </div>

      {/* Tournament Info */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <h2 className="text-sm font-medium text-gray-600 mb-1">{tournamentData.tournamentName}</h2>
        <p className="text-xs text-gray-500">
          {tournamentData.numberOfPeople} players • {tournamentData.pointsToPlay} points
        </p>
      </div>

      {/* Match Display */}
      <div className="px-6 py-8">
        {currentMatch && (
          <div className="space-y-8">
            {/* Teams */}
            <div className="space-y-6">
              {/* Team 1 */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-sm font-medium text-blue-800 mb-4 text-center">Team 1</h3>
                <div className="space-y-3">
                  {currentMatch.team1.players.map((player, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 text-center">
                      <span className="text-lg font-medium text-gray-800">{player}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* VS Divider */}
              <div className="text-center">
                <span className="text-2xl font-bold text-gray-400">VS</span>
              </div>

              {/* Team 2 */}
              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="text-sm font-medium text-red-800 mb-4 text-center">Team 2</h3>
                <div className="space-y-3">
                  {currentMatch.team2.players.map((player, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 text-center">
                      <span className="text-lg font-medium text-gray-800">{player}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Next Match Button */}
            <div className="pt-4">
              <button
                onClick={generateRandomMatch}
                className="w-full bg-gray-900 text-white py-4 px-6 rounded-xl font-medium text-lg hover:bg-gray-800 transition-colors duration-200 active:scale-95 transform flex items-center justify-center"
              >
                <Shuffle className="w-5 h-5 mr-2" />
                Generate Next Match
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Leaderboard Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
        <button
          onClick={handleLeaderboard}
          className="w-full bg-white border-2 border-gray-900 text-gray-900 py-4 px-6 rounded-xl font-medium text-lg hover:bg-gray-50 transition-colors duration-200 active:scale-95 transform flex items-center justify-center"
        >
          <Trophy className="w-5 h-5 mr-2" />
          Leaderboard
        </button>
      </div>
    </div>
  );
}

export default MatchesPage;