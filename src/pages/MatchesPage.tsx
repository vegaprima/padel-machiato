import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Shuffle, Trophy, Plus, Minus, History } from 'lucide-react';

interface TournamentData {
  tournamentName: string;
  numberOfPeople: number;
  numberOfCourts: number;
  pointsToPlay: number;
  tournamentType: string;
  players: string[];
  teams?: Team[];
}

interface PlayerTeam {
  name: string;
  color: string;
  players: [string, string];
}

interface MatchTeam {
  players: string[];
  score: number;
}

interface Match {
  id: number;
  courtNumber: number;
  team1: MatchTeam;
  team2: MatchTeam;
  isCompleted: boolean;
  timestamp: Date;
}

interface ScoreInputModal {
  isOpen: boolean;
  team: 'team1' | 'team2' | null;
  currentScore: number;
  matchId?: number;
}
function MatchesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const tournamentData = location.state as TournamentData;
  
  const [currentMatches, setCurrentMatches] = useState<Match[]>([]);
  const [matchHistory, setMatchHistory] = useState<Match[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [playerLastPlayedRound, setPlayerLastPlayedRound] = useState<{[key: string]: number}>({});
  const [currentRound, setCurrentRound] = useState(1);
  const [scoreModal, setScoreModal] = useState<ScoreInputModal>({
    isOpen: false,
    team: null,
    currentScore: 0
  });
  const [tempScore, setTempScore] = useState('');

  useEffect(() => {
    if (!tournamentData) {
      navigate('/players');
      return;
    }
    
    // Check if we have the required data based on tournament type
    if (tournamentData.tournamentType === 'Americano' && (!tournamentData.players || tournamentData.players.length < 4)) {
      navigate('/players');
      return;
    }
    
    if (tournamentData.tournamentType === 'Fixed Partner' && (!tournamentData.teams || tournamentData.teams.length < 2)) {
      navigate('/players');
      return;
    }
    
    generateRandomMatch();
  }, [tournamentData, navigate]);

  const generateRandomMatch = () => {
    const matches: Match[] = [];
    const usedPlayers = new Set<string>();
    
    // Get all available players
    let availablePlayers: string[] = [];
    if (tournamentData.tournamentType === 'Americano') {
      availablePlayers = [...tournamentData.players];
    } else if (tournamentData.tournamentType === 'Fixed Partner') {
      // For fixed partner, we work with teams but track individual players for idle logic
      availablePlayers = tournamentData.teams?.flatMap(team => team.players) || [];
    }
    
    // Prioritize idle players (those who didn't play in the previous round)
    const idlePlayers = availablePlayers.filter(player => 
      playerLastPlayedRound[player] !== currentRound - 1
    );
    const recentlyPlayedPlayers = availablePlayers.filter(player => 
      playerLastPlayedRound[player] === currentRound - 1
    );
    
    // Combine prioritized players (idle first, then recently played)
    const prioritizedPlayers = [...idlePlayers, ...recentlyPlayedPlayers];
    
    for (let court = 1; court <= tournamentData.numberOfCourts; court++) {
      if (tournamentData.tournamentType === 'Americano') {
        // Americano logic - select 4 players prioritizing idle ones
        const availableForThisCourt = prioritizedPlayers.filter(player => !usedPlayers.has(player));
        
        if (availableForThisCourt.length < 4) {
          // Not enough players for this court
          break;
        }
        
        // Select 4 players
        const selectedPlayers = availableForThisCourt.slice(0, 4);
        selectedPlayers.forEach(player => usedPlayers.add(player));
        
        // Shuffle the selected players and create teams
        const shuffledPlayers = [...selectedPlayers].sort(() => Math.random() - 0.5);
        const team1 = { players: [shuffledPlayers[0], shuffledPlayers[1]], score: 0 };
        const team2 = { players: [shuffledPlayers[2], shuffledPlayers[3]], score: 0 };
        
        const newMatch: Match = {
          id: Date.now() + court,
          courtNumber: court,
          team1,
          team2,
          isCompleted: false,
          timestamp: new Date()
        };
        
        matches.push(newMatch);
        
      } else if (tournamentData.tournamentType === 'Fixed Partner') {
        // Fixed Partner logic - select teams but prioritize those with idle players
        const availableTeams = tournamentData.teams?.filter(team => 
          !team.players.some(player => usedPlayers.has(player))
        ) || [];
        
        if (availableTeams.length < 2) {
          // Not enough teams for this court
          break;
        }
        
        // Sort teams by priority (teams with more idle players first)
        const sortedTeams = availableTeams.sort((a, b) => {
          const aIdleCount = a.players.filter(player => 
            playerLastPlayedRound[player] !== currentRound - 1
          ).length;
          const bIdleCount = b.players.filter(player => 
            playerLastPlayedRound[player] !== currentRound - 1
          ).length;
          return bIdleCount - aIdleCount;
        });
        
        // Select first 2 teams
        const selectedTeams = sortedTeams.slice(0, 2);
        selectedTeams.forEach(team => 
          team.players.forEach(player => usedPlayers.add(player))
        );
        
        const team1 = { 
          players: [selectedTeams[0].players[0], selectedTeams[0].players[1]], 
          score: 0,
          teamName: selectedTeams[0].name
        };
        const team2 = { 
          players: [selectedTeams[1].players[0], selectedTeams[1].players[1]], 
          score: 0,
          teamName: selectedTeams[1].name
        };
        
        const newMatch: Match = {
          id: Date.now() + court,
          courtNumber: court,
          team1,
          team2,
          isCompleted: false,
          timestamp: new Date()
        };
        
        matches.push(newMatch);
      }
    }
    
    setCurrentMatches(matches);
  };

  const generateRandomMatchOld = () => {
    if (tournamentData.tournamentType === 'Americano') {
      // Americano logic - randomize individual players
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
        courtNumber: 1,
        team1,
        team2,
        isCompleted: false,
        timestamp: new Date()
      };
      
      setCurrentMatches([newMatch]);
    } else if (tournamentData.tournamentType === 'Fixed Partner') {
      // Fixed Partner logic - randomize teams only
      if (!tournamentData?.teams || tournamentData.teams.length < 2) return;

      // Shuffle teams array
      const shuffledTeams = [...tournamentData.teams].sort(() => Math.random() - 0.5);
      
      // Select 2 random teams
      const selectedTeams = shuffledTeams.slice(0, 2);
      
      // Create match teams from fixed partner teams
      const team1 = { 
        players: [selectedTeams[0].players[0], selectedTeams[0].players[1]], 
        score: 0,
        teamName: selectedTeams[0].name
      };
      const team2 = { 
        players: [selectedTeams[1].players[0], selectedTeams[1].players[1]], 
        score: 0,
        teamName: selectedTeams[1].name
      };
      
      const newMatch: Match = {
        id: Date.now(),
        courtNumber: 1,
        team1,
        team2,
        isCompleted: false,
        timestamp: new Date()
      };
      
      setCurrentMatches([newMatch]);
    }
  };
    

  const updateScore = (matchId: number, team: 'team1' | 'team2', increment: boolean) => {
    setCurrentMatches(prev => prev.map(match => {
      if (match.id !== matchId) return match;
      
      const updatedMatch = { ...match };
      if (increment) {
        updatedMatch[team].score += 1;
      } else {
        updatedMatch[team].score = Math.max(0, updatedMatch[team].score - 1);
      }
      
      return updatedMatch;
    }));
  };

  const openScoreModal = (matchId: number, team: 'team1' | 'team2') => {
    const match = currentMatches.find(m => m.id === matchId);
    if (!match) return;
    
    setScoreModal({
      isOpen: true,
      team,
      currentScore: match[team].score,
      matchId
    });
    setTempScore(match[team].score.toString());
  };

  const closeScoreModal = () => {
    setScoreModal({
      isOpen: false,
      team: null,
      currentScore: 0
    });
    setTempScore('');
  };

  const handleScoreSubmit = () => {
    if (!scoreModal.team || !scoreModal.matchId) return;
    
    const inputScore = parseInt(tempScore);
    const maxPoints = tournamentData.pointsToPlay;
    
    // Validate input
    if (isNaN(inputScore) || inputScore < 0 || inputScore > maxPoints) {
      return;
    }
    
    setCurrentMatches(prev => prev.map(match => {
      if (match.id !== scoreModal.matchId) return match;
      
      const updatedMatch = { ...match };
      const otherTeam = scoreModal.team === 'team1' ? 'team2' : 'team1';
      
      // Set the input team's score
      updatedMatch[scoreModal.team!].score = inputScore;
      
      // Calculate the other team's score (max points - input score)
      updatedMatch[otherTeam].score = maxPoints - inputScore;
      
      return updatedMatch;
    }));
    
    closeScoreModal();
  };

  const completeMatch = (matchId: number) => {
    const matchToComplete = currentMatches.find(m => m.id === matchId);
    if (!matchToComplete) return;

    const completedMatch = {
      ...matchToComplete,
      isCompleted: true
    };

    // Update player last played round
    const updatedPlayerLastPlayed = { ...playerLastPlayedRound };
    [...completedMatch.team1.players, ...completedMatch.team2.players].forEach(player => {
      updatedPlayerLastPlayed[player] = currentRound;
    });
    setPlayerLastPlayedRound(updatedPlayerLastPlayed);

    setMatchHistory(prev => [completedMatch, ...prev]);
    
    // Remove completed match from current matches
    setCurrentMatches(prev => prev.filter(m => m.id !== matchId));
  };

  const completeAllMatches = () => {
    // Complete all current matches
    const completedMatches = currentMatches.map(match => ({
      ...match,
      isCompleted: true
    }));

    // Update player last played round for all players
    const updatedPlayerLastPlayed = { ...playerLastPlayedRound };
    completedMatches.forEach(match => {
      [...match.team1.players, ...match.team2.players].forEach(player => {
        updatedPlayerLastPlayed[player] = currentRound;
      });
    });
    setPlayerLastPlayedRound(updatedPlayerLastPlayed);

    setMatchHistory(prev => [...completedMatches, ...prev]);
    setCurrentRound(prev => prev + 1);
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
          onClick={showHistory ? () => setShowHistory(false) : handleBack}
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
          {tournamentData.tournamentType} • {tournamentData.numberOfCourts} court{tournamentData.numberOfCourts > 1 ? 's' : ''} • {tournamentData.numberOfPeople} players • {tournamentData.pointsToPlay} points
        </p>
        {!showHistory && (
          <p className="text-xs text-blue-600 mt-1">Round {currentRound}</p>
        )}
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
                      Court {match.courtNumber} • {match.timestamp.toLocaleTimeString()}
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
          currentMatches.length > 0 && (
            <div className="space-y-6">
              {/* Current Matches */}
              {currentMatches.map((match) => (
                <div key={match.id} className="border border-gray-200 rounded-xl p-6">
                  {/* Court Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-medium text-gray-800">Court {match.courtNumber}</h3>
                  </div>
                  
                  {/* Teams with Scores */}
                  <div className="space-y-6">
                    {/* Team 1 */}
                    <div className="bg-blue-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-blue-800">
                          {match.team1.teamName || 'Team 1'}
                        </h4>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateScore(match.id, 'team1', false)}
                            className="w-8 h-8 bg-blue-200 hover:bg-blue-300 rounded-full flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-4 h-4 text-blue-800" />
                          </button>
                          <button
                            onClick={() => openScoreModal(match.id, 'team1')}
                            className="text-2xl font-bold text-blue-800 min-w-[3rem] text-center hover:bg-blue-200 rounded-lg px-2 py-1 transition-colors"
                          >
                            {match.team1.score}
                          </button>
                          <button
                            onClick={() => updateScore(match.id, 'team1', true)}
                            className="w-8 h-8 bg-blue-200 hover:bg-blue-300 rounded-full flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-4 h-4 text-blue-800" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {match.team1.players.map((player, index) => (
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
                        <h4 className="text-sm font-medium text-red-800">
                          {match.team2.teamName || 'Team 2'}
                        </h4>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateScore(match.id, 'team2', false)}
                            className="w-8 h-8 bg-red-200 hover:bg-red-300 rounded-full flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-4 h-4 text-red-800" />
                          </button>
                          <button
                            onClick={() => openScoreModal(match.id, 'team2')}
                            className="text-2xl font-bold text-red-800 min-w-[3rem] text-center hover:bg-red-200 rounded-lg px-2 py-1 transition-colors"
                          >
                            {match.team2.score}
                          </button>
                          <button
                            onClick={() => updateScore(match.id, 'team2', true)}
                            className="w-8 h-8 bg-red-200 hover:bg-red-300 rounded-full flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-4 h-4 text-red-800" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {match.team2.players.map((player, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 text-center">
                            <span className="text-lg font-medium text-gray-800">{player}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Individual Match Complete Button */}
                  <div className="mt-6">
                    <button
                      onClick={() => completeMatch(match.id)}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Complete Match
                    </button>
                  </div>
                </div>
              ))}

              {/* Global Action Buttons */}
              <div className="space-y-4 pt-4">
                {currentMatches.length > 1 && (
                  <button
                    onClick={completeAllMatches}
                    className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-medium text-lg hover:bg-green-700 transition-colors duration-200 active:scale-95 transform"
                  >
                    Complete All Matches & Generate Next Round
                  </button>
                )}
                
                <button
                  onClick={generateRandomMatch}
                  className="w-full bg-gray-900 text-white py-4 px-6 rounded-xl font-medium text-lg hover:bg-gray-800 transition-colors duration-200 active:scale-95 transform flex items-center justify-center"
                >
                  <Shuffle className="w-5 h-5 mr-2" />
                  Generate New Round
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

      {/* Score Input Modal */}
      {scoreModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            {(() => {
              const match = currentMatches.find(m => m.id === scoreModal.matchId);
              const teamName = scoreModal.team === 'team1' ? 
                (match?.team1.teamName || 'Team 1') : 
                (match?.team2.teamName || 'Team 2');
              
              return (
            <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">
                Enter Score for {teamName}
            </h3>
              );
            })()}
            
            <div className="mb-6">
              <input
                type="number"
                value={tempScore}
                onChange={(e) => setTempScore(e.target.value)}
                min="0"
                max={tournamentData.pointsToPlay}
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-lg text-center"
                placeholder="Enter score"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Max score: {tournamentData.pointsToPlay} points
              </p>
              {tempScore && !isNaN(parseInt(tempScore)) && parseInt(tempScore) <= tournamentData.pointsToPlay && (
                <p className="text-xs text-blue-600 mt-1 text-center">
                  Other team will get: {tournamentData.pointsToPlay - parseInt(tempScore)} points
                </p>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={closeScoreModal}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleScoreSubmit}
                disabled={!tempScore || isNaN(parseInt(tempScore)) || parseInt(tempScore) < 0 || parseInt(tempScore) > tournamentData.pointsToPlay}
                className="flex-1 py-3 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Set Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchesPage;