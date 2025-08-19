import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext.jsx';
import { WalletProvider } from './contexts/WalletContext.jsx';
import { NotificationProvider } from './contexts/NotificationContext.jsx';
import './i18n'; // Import i18n configuration

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <WalletProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </WalletProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
