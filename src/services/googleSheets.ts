import { GoogleAuth } from 'googleapis';

interface TournamentData {
  tournamentName: string;
  tournamentType: string;
  numberOfPeople: number;
  pointsToPlay: number;
  players?: string[];
  teams?: Array<{
    name: string;
    color: string;
    players: [string, string];
  }>;
  timestamp: string;
}

interface Match {
  id: number;
  team1: {
    players: string[];
    score: number;
    teamName?: string;
  };
  team2: {
    players: string[];
    score: number;
    teamName?: string;
  };
  isCompleted: boolean;
  timestamp: Date;
}

export class GoogleSheetsService {
  private auth: GoogleAuth;
  private spreadsheetId: string;

  constructor(credentials: any, spreadsheetId: string) {
    this.auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    this.spreadsheetId = spreadsheetId;
  }

  async saveTournamentData(tournamentData: TournamentData): Promise<void> {
    try {
      const sheets = google.sheets({ version: 'v4', auth: this.auth });
      
      // Create tournament info sheet
      const tournamentInfo = [
        ['Tournament Name', tournamentData.tournamentName],
        ['Tournament Type', tournamentData.tournamentType],
        ['Number of Players', tournamentData.numberOfPeople.toString()],
        ['Points to Play', tournamentData.pointsToPlay.toString()],
        ['Created At', tournamentData.timestamp],
        [''], // Empty row
      ];

      // Add players/teams data
      if (tournamentData.tournamentType === 'Americano' && tournamentData.players) {
        tournamentInfo.push(['Players:']);
        tournamentData.players.forEach((player, index) => {
          tournamentInfo.push([`Player ${index + 1}`, player]);
        });
      } else if (tournamentData.tournamentType === 'Fixed Partner' && tournamentData.teams) {
        tournamentInfo.push(['Teams:']);
        tournamentData.teams.forEach((team) => {
          tournamentInfo.push([team.name, `${team.players[0]} & ${team.players[1]}`]);
        });
      }

      // Write to spreadsheet
      await sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'Tournament Info!A1',
        valueInputOption: 'RAW',
        requestBody: {
          values: tournamentInfo,
        },
      });

      // Create match history header
      const matchHeaders = [
        ['Match ID', 'Team 1 Players', 'Team 1 Score', 'Team 2 Players', 'Team 2 Score', 'Winner', 'Timestamp']
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'Match History!A1',
        valueInputOption: 'RAW',
        requestBody: {
          values: matchHeaders,
        },
      });

    } catch (error) {
      console.error('Error saving tournament data to Google Sheets:', error);
      throw error;
    }
  }

  async saveMatchResult(match: Match): Promise<void> {
    try {
      const sheets = google.sheets({ version: 'v4', auth: this.auth });
      
      const winner = match.team1.score > match.team2.score ? 
        match.team1.players.join(' & ') : 
        match.team2.players.join(' & ');

      const matchData = [
        match.id.toString(),
        match.team1.players.join(' & '),
        match.team1.score.toString(),
        match.team2.players.join(' & '),
        match.team2.score.toString(),
        winner,
        match.timestamp.toISOString()
      ];

      // Append to match history
      await sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Match History!A:G',
        valueInputOption: 'RAW',
        requestBody: {
          values: [matchData],
        },
      });

    } catch (error) {
      console.error('Error saving match result to Google Sheets:', error);
      throw error;
    }
  }
}

// Export a singleton instance
let sheetsService: GoogleSheetsService | null = null;

export const initializeGoogleSheets = (credentials: any, spreadsheetId: string) => {
  sheetsService = new GoogleSheetsService(credentials, spreadsheetId);
  return sheetsService;
};

export const getGoogleSheetsService = (): GoogleSheetsService | null => {
  return sheetsService;
};