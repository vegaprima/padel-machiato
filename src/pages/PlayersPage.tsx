import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, Users } from 'lucide-react';

interface TournamentData {
  tournamentName: string;
  numberOfPeople: number;
  pointsToPlay: number;
  tournamentType: string;
}

interface Team {
  name: string;
  color: string;
  players: [string, string];
}

function PlayersPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const tournamentData = location.state as TournamentData;
  
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const teamColors = [
    { name: 'White', color: 'bg-gray-100 border-gray-300 text-gray-800' },
    { name: 'Blue', color: 'bg-blue-100 border-blue-300 text-blue-800' },
    { name: 'Red', color: 'bg-red-100 border-red-300 text-red-800' },
    { name: 'Green', color: 'bg-green-100 border-green-300 text-green-800' },
    { name: 'Yellow', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
    { name: 'Purple', color: 'bg-purple-100 border-purple-300 text-purple-800' },
    { name: 'Pink', color: 'bg-pink-100 border-pink-300 text-pink-800' },
    { name: 'Orange', color: 'bg-orange-100 border-orange-300 text-orange-800' },
  ];

  useEffect(() => {
    if (!tournamentData) {
      navigate('/tournament');
      return;
    }

    if (tournamentData.tournamentType === 'Americano') {
      // Initialize empty player names array for Americano
      setPlayerNames(new Array(tournamentData.numberOfPeople).fill(''));
    } else if (tournamentData.tournamentType === 'Fixed Partner') {
      // Initialize teams for Fixed Partner
      const numberOfTeams = tournamentData.numberOfPeople / 2;
      const initialTeams: Team[] = [];
      
      for (let i = 0; i < numberOfTeams; i++) {
        initialTeams.push({
          name: `Team ${teamColors[i].name}`,
          color: teamColors[i].color,
          players: ['', '']
        });
      }
      
      setTeams(initialTeams);
    }
  }, [tournamentData, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const updatedNames = [...playerNames];
    updatedNames[index] = name;
    setPlayerNames(updatedNames);
  };

  const handleTeamPlayerChange = (teamIndex: number, playerIndex: number, name: string) => {
    const updatedTeams = [...teams];
    updatedTeams[teamIndex].players[playerIndex] = name;
    setTeams(updatedTeams);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (tournamentData.tournamentType === 'Americano') {
      // Navigate to matches page with player names for Americano
      navigate('/matches', {
        state: {
          ...tournamentData,
          players: playerNames.filter(name => name.trim())
        }
      });
    } else if (tournamentData.tournamentType === 'Fixed Partner') {
      // Navigate to matches page with teams for Fixed Partner
      navigate('/matches', {
        state: {
          ...tournamentData,
          teams: teams,
          players: [] // Add empty players array for consistency
        }
      });
    }
  };

  const isFormValid = () => {
    if (tournamentData.tournamentType === 'Americano') {
      return playerNames.every(name => name.trim().length > 0);
    } else if (tournamentData.tournamentType === 'Fixed Partner') {
      return teams.every(team => 
        team.players[0].trim().length > 0 && 
        team.players[1].trim().length > 0
      );
    }
    return false;
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
        <h1 className="text-lg font-medium text-gray-800">
          {tournamentData.tournamentType === 'Americano' ? 'Add Players' : 'Add Teams'}
        </h1>
        <div className="w-10"></div>
      </div>

      {/* Tournament Info */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <h2 className="text-sm font-medium text-gray-600 mb-1">{tournamentData.tournamentName}</h2>
        <p className="text-xs text-gray-500">
          {tournamentData.tournamentType} • {tournamentData.numberOfPeople} players • {tournamentData.pointsToPlay} points
        </p>
      </div>

      {/* Players/Teams Form */}
      <div className="px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {tournamentData.tournamentType === 'Americano' ? (
            /* Americano - Individual Players */
            playerNames.map((name, index) => (
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
            ))
          ) : (
            /* Fixed Partner - Teams */
            teams.map((team, teamIndex) => (
              <div key={teamIndex} className={`border-2 rounded-xl p-6 ${team.color}`}>
                <label className="flex items-center text-sm font-medium mb-4">
                  <Users className="w-4 h-4 mr-2" />
                  {team.name}
                </label>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={team.players[0]}
                      onChange={(e) => handleTeamPlayerChange(teamIndex, 0, e.target.value)}
                      placeholder="Enter first player name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={team.players[1]}
                      onChange={(e) => handleTeamPlayerChange(teamIndex, 1, e.target.value)}
                      placeholder="Enter second player name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                    />
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Submit Button */}
          <div className="pt-8">
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`w-full py-4 px-6 rounded-xl font-medium text-lg transition-all duration-200 ${
                isFormValid()
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