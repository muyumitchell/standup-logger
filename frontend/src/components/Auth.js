import React, { useState } from 'react';
import axios from 'axios';

const API = 'https://standup-logger-backend.onrender.com/api';

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.username.trim() || !form.password.trim()) {
      setError('Both fields are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const endpoint = isLogin ? 'auth/login/' : 'auth/register/';
      const res = await axios.post(`${API}/${endpoint}`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      onLogin(res.data.username);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🚀 Standup Logger</h1>
        <p>{isLogin ? 'Welcome back! Sign in to continue' : 'Create your account to get started'}</p>

        {error && <div className="alert error">⚠️ {error}</div>}

        <div className="field">
          <label>Username</label>
          <input
            value={form.username}
            onChange={e => setForm({...form, username: e.target.value})}
            placeholder="Enter your username"
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            placeholder="Enter your password"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? '⏳ Please wait...' : isLogin ? '🔐 Sign In' : '✨ Create Account'}
        </button>

        <div className="demo-divider">or</div>

        <button className="demo-btn" onClick={() => onLogin('Guest')}>
          👀 View as Guest
        </button>

        <div className="auth-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Register here' : 'Sign in here'}
          </span>
        </div>
      </div>
    </div>
  );