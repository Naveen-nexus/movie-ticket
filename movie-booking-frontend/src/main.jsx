import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'toast-custom',
            duration: 3000,
            style: {
              background: '#161B22',
              color: '#E6EDF3',
              border: '1px solid #30363D',
            },
            success: {
              iconTheme: {
                primary: '#3FB950',
                secondary: '#161B22',
              },
            },
            error: {
              iconTheme: {
                primary: '#F85149',
                secondary: '#161B22',
              },
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
