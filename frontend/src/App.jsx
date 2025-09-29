import React, { useState, useEffect } from 'react';
import LoginPage from './pages/login/LoginPage';
import MainPage from './pages/main/MainPage';
import './App.css';
import { isTokenExpired, parseJwt } from './utils/jwt';

// Helper to get token
export function getToken() {
  return localStorage.getItem('token');
}

function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    const token = getToken();
    return token && !isTokenExpired(token);
  });
  const [loginMessage, setLoginMessage] = useState('');

  const handleLogin = async (username, password) => {
    setLoginMessage('');
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setLoggedIn(true);
      } else {
        const text = await response.text();
        setLoginMessage(text || 'Invalid credentials');
      }
    } catch (err) {
      setLoginMessage('Error connecting to server');
    }
  };

  // Automatic token validation on mount and when loggedIn changes
  useEffect(() => {
    const checkToken = () => {
      const token = getToken();
      if (!token || isTokenExpired(token)) {
        localStorage.removeItem('token');
        setLoggedIn(false);
      }
    };
    checkToken();
    // Optionally, check every minute for token expiry
    const interval = setInterval(checkToken, 60000);
    return () => clearInterval(interval);
  }, [loggedIn]);

  if (loggedIn) {
    return <MainPage onLogout={() => { localStorage.removeItem('token'); setLoggedIn(false); }} />;
  }
  return <LoginPage onLogin={handleLogin} message={loginMessage} />;
}

export default App;
