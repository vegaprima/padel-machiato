// Google Sheets Configuration
// You'll need to replace these with your actual values

export const GOOGLE_SHEETS_CONFIG = {
  // Your Google Service Account credentials (JSON format)
  credentials: {
    type: "service_account",
    project_id: "your-project-id",
    private_key_id: "your-private-key-id",
    private_key: "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n",
    client_email: "your-service-account@your-project-id.iam.gserviceaccount.com",
    client_id: "your-client-id",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project-id.iam.gserviceaccount.com"
  },
  
  // Your Google Spreadsheet ID (from the URL)
  spreadsheetId: "your-spreadsheet-id-here"
};

// Initialize the Google Sheets service
import { initializeGoogleSheets } from '../services/googleSheets';

export const setupGoogleSheets = () => {
  return initializeGoogleSheets(GOOGLE_SHEETS_CONFIG.credentials, GOOGLE_SHEETS_CONFIG.spreadsheetId);
};