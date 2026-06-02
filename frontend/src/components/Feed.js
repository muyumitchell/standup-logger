import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:8000/api';

function getWeatherIcon(code) {
  if (code === 0) return '☀️';
  if (code <= 2) return '⛅';
  if (code <= 48) return '☁️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '🌨️';
  if (code <= 82) return '🌦️';
  return '⛈️';
}

function Feed() {
  const [posts, setPosts] = useState([]);
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API}/standups/`);
      setPosts(res.data);
      setApiError(false);
    } catch {
      setApiError(true);
    }
    setLoading(false);
  };

  const fetchWeather = async () => {
    try {
      const res = await axios.get(
        'https://api.open-meteo.com/v1/forecast?latitude=-1.2921&longitude=36.8219&current_weather=true'
      );
      setWeather(res.data.current_weather);
    } catch {
      setWeatherError(true);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchWeather();
    const interval = setInterval(fetchPosts, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card feed-card">
      <div className="feed-header">
        <h2>📋 Live Activity Feed</h2>
        {weather && !weatherError && (
          <div className="weather">
            {getWeatherIcon(weather.weathercode)} {Math.round(weather.temperature)}°C — Nairobi
          </div>
        )}
        {weatherError && <div className="weather">🌍 Nairobi — weather unavailable</div>}
      </div>

      {loading && <p>Loading posts...</p>}
      {apiError && <div className="alert error">⚠️ Could not load posts. Retrying...</div>}

      {!loading && posts.length === 0 && (
        <p className="empty">No standups posted yet. Be the first! 👆</p>
      )}

      {posts.map(post => (
        <div key={post.id} className={`post-card ${post.has_blocker ? 'has-blocker' : ''}`}>
          <div className="post-header">
            <span className="author">👤 {post.author}</span>
            <span className="timestamp">{new Date(post.timestamp).toLocaleString()}</span>
            {post.has_blocker && <span className="blocker-badge">🚨 BLOCKER</span>}
          </div>
          <div className="post-field">
            <strong>Yesterday:</strong> {post.yesterday}
          </div>
          <div className="post-field">
            <strong>Today:</strong> {post.today}
          </div>
          {post.blockers && (
            <div className="post-field">
              <strong>Blockers:</strong> {post.blockers}
            </div>
          )}
          {post.attachment && (
            <div className="post-field">
              <a href={`http://127.0.0.1:8000${post.attachment}`} target="_blank" rel="noreferrer">
                📎 View Attachment
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Feed;