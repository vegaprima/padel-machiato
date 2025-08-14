import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { setupGoogleSheets } from './config/googleSheets';

// Initialize Google Sheets service
try {
  setupGoogleSheets();
  console.log('Google Sheets service initialized');
} catch (error) {
  console.warn('Google Sheets service not configured:', error);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
