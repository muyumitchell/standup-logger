import React from 'react';
import StandupForm from './components/StandupForm';
import Feed from './components/Feed';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 Team Standup Logger</h1>
        <p>Post your daily updates and see what your team is working on</p>
      </header>
      <div className="app-body">
        <StandupForm />
        <Feed />
      </div>
      <Dashboard />
    </div>
  );
}

export default App;