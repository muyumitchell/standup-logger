import React, { useState, useEffect } from 'react';
import StandupForm from './components/StandupForm';
import Feed from './components/Feed';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('username');
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-top">
          <span className="logged-in-as">👤 {user}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
        <h1>🚀 Team Standup Logger</h1>
        <p>Post your daily updates and see what your team is working on</p>
      </header>
      <div className="app-body">
        <StandupForm />
        <Feed currentUser={user} />
      </div>
      <Dashboard />
    </div>
  );
}

export default App;