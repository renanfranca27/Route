import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import History from './components/History';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleNavigation = (tab) => {
    setCurrentTab(tab);
    navigate(`/${tab}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  if (!isLoggedIn) {
    return <Login setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <div className="App">
      <header className="header">
        <div>
          <div className="header-logo">
            <span>🚗</span>
            <div>
              <span>RouteLog</span>
              <div className="header-subtitle">Comparador de rotas</div>
            </div>
          </div>
        </div>
        <nav className="header-nav">
          <button
            className={`nav-button ${currentTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigation('dashboard')}
          >
            Planejar rota
          </button>
          <button
            className={`nav-button ${currentTab === 'history' ? 'active' : ''}`}
            onClick={() => handleNavigation('history')}
          >
            Histórico
          </button>
          <button
            className={`nav-button ${currentTab === 'settings' ? 'active' : ''}`}
            onClick={() => handleNavigation('settings')}
          >
            Configurações
          </button>
          <button className="nav-button" onClick={handleLogout}>
            Sair
          </button>
        </nav>
      </header>

      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}