import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Shuffle, Trophy, Plus, Minus, History } from 'lucide-react';

interface TournamentData {
  tournamentName: string;
  numberOfPeople: number;
  pointsToPlay: number;
  players: string[];
}

interface Team {
  players: string[];
  score: number;
}

interface Match {
  id: number;
  team1: Team;
  team2: Team;
  isCompleted: boolean;
  timestamp: Date;
}

function MatchesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const tournamentData = location.state as TournamentData;
  
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [matchHistory, setMatchHistory] = useState<Match[]>([]);
  const [showHistory, setShowHistory] = useState(false);

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
    const team1 = { players: [selectedPlayers[0], selectedPlayers[1]], score: 0 };
    const team2 = { players: [selectedPlayers[2], selectedPlayers[3]], score: 0 };
    
    const newMatch: Match = {
      id: Date.now(),
      team1,
      team2,
      isCompleted: false,
      timestamp: new Date()
    };
    
    setCurrentMatch(newMatch);
  };

  const updateScore = (team: 'team1' | 'team2', increment: boolean) => {
    if (!currentMatch) return;

    const updatedMatch = { ...currentMatch };
    if (increment) {
      updatedMatch[team].score += 1;
    } else {
      updatedMatch[team].score = Math.max(0, updatedMatch[team].score - 1);
    }
    
    setCurrentMatch(updatedMatch);
  };

  const completeMatch = () => {
    if (!currentMatch) return;

    const completedMatch = {
      ...currentMatch,
      isCompleted: true
    };

    setMatchHistory(prev => [completedMatch, ...prev]);
    generateRandomMatch();
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleLeaderboard = () => {
    // TODO: Navigate to leaderboard page
    console.log('Navigate to leaderboard');
  };

  if (!tournamentData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <button 
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-medium text-gray-800">
          {showHistory ? 'Match History' : 'Current Match'}
        </h1>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <History className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Tournament Info */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <h2 className="text-sm font-medium text-gray-600 mb-1">{tournamentData.tournamentName}</h2>
        <p className="text-xs text-gray-500">
          {tournamentData.numberOfPeople} players • {tournamentData.pointsToPlay} points
        </p>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        {showHistory ? (
          /* Match History */
          <div className="space-y-4">
            {matchHistory.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No completed matches yet</p>
              </div>
            ) : (
              matchHistory.map((match) => (
                <div key={match.id} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-500">
                      {match.timestamp.toLocaleTimeString()}
                    </span>
                    <span className="text-lg font-bold text-gray-800">
                      {match.team1.score} - {match.team2.score}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <div className="text-center">
                      <div className="space-y-1">
                        {match.team1.players.map((player, index) => (
                          <div key={index} className="text-sm font-medium text-gray-700">
                            {player}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-medium text-gray-400">VS</span>
                    </div>
                    <div className="text-center">
                      <div className="space-y-1">
                        {match.team2.players.map((player, index) => (
                          <div key={index} className="text-sm font-medium text-gray-700">
                            {player}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Current Match */
          currentMatch && (
            <div className="space-y-8">
              {/* Teams with Scores */}
              <div className="space-y-6">
                {/* Team 1 */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-blue-800">Team 1</h3>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateScore('team1', false)}
                        className="w-8 h-8 bg-blue-200 hover:bg-blue-300 rounded-full flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-4 h-4 text-blue-800" />
                      </button>
                      <span className="text-2xl font-bold text-blue-800 min-w-[3rem] text-center">
                        {currentMatch.team1.score}
                      </span>
                      <button
                        onClick={() => updateScore('team1', true)}
                        className="w-8 h-8 bg-blue-200 hover:bg-blue-300 rounded-full flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4 text-blue-800" />
                      </button>
                    </div>
                  </div>
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
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-red-800">Team 2</h3>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateScore('team2', false)}
                        className="w-8 h-8 bg-red-200 hover:bg-red-300 rounded-full flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-4 h-4 text-red-800" />
                      </button>
                      <span className="text-2xl font-bold text-red-800 min-w-[3rem] text-center">
                        {currentMatch.team2.score}
                      </span>
                      <button
                        onClick={() => updateScore('team2', true)}
                        className="w-8 h-8 bg-red-200 hover:bg-red-300 rounded-full flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4 text-red-800" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {currentMatch.team2.players.map((player, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 text-center">
                        <span className="text-lg font-medium text-gray-800">{player}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={completeMatch}
                  className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-medium text-lg hover:bg-green-700 transition-colors duration-200 active:scale-95 transform"
                >
                  Complete Match & Generate Next
                </button>
                
                <button
                  onClick={generateRandomMatch}
                  className="w-full bg-gray-900 text-white py-4 px-6 rounded-xl font-medium text-lg hover:bg-gray-800 transition-colors duration-200 active:scale-95 transform flex items-center justify-center"
                >
                  <Shuffle className="w-5 h-5 mr-2" />
                  Generate New Match
                </button>
              </div>
            </div>
          )
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