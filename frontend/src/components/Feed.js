import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://standup-logger-backend.onrender.com/api';

const TEAM_MEMBERS = [
  'All Members',
  'Alice Kamau',
  'Brian Omondi',
  'Carol Wanjiku',
  'David Mutua',
  'Mitchell Muyu',
  'Other'
];

function getWeatherIcon(code) {
  if (code === 0) return '☀️';
  if (code <= 2) return '⛅';
  if (code <= 48) return '☁️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '🌨️';
  if (code <= 82) return '🌦️';
  return '⛈️';
}

function Feed({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [filterMember, setFilterMember] = useState('All Members');
  const [filterDate, setFilterDate] = useState('');
  const [search, setSearch] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({});

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

  const handleEdit = (post) => {
    setEditingPost(post.id);
    setEditForm({
      yesterday: post.yesterday,
      today: post.today,
      blockers: post.blockers,
      has_blocker: post.has_blocker
    });
  };

  const handleSaveEdit = async (postId) => {
    try {
      await axios.patch(`${API}/standups/${postId}/`, editForm);
      setEditingPost(null);
      fetchPosts();
    } catch {
      alert('Failed to save changes. Please try again.');
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchMember = filterMember === 'All Members' || post.author === filterMember;
    const matchDate = !filterDate || post.timestamp.startsWith(filterDate);
    const matchSearch = !search ||
      post.author.toLowerCase().includes(search.toLowerCase()) ||
      post.yesterday.toLowerCase().includes(search.toLowerCase()) ||
      post.today.toLowerCase().includes(search.toLowerCase()) ||
      post.blockers.toLowerCase().includes(search.toLowerCase());
    return matchMember && matchDate && matchSearch;
  });

  const blockerCount = filteredPosts.filter(p => p.has_blocker).length;

  return (
    <div className="card feed-card">
      <div className="feed-header">
        <div>
          <h2>📋 Live Activity Feed</h2>
          <p className="feed-subtitle">
            {posts.length} update{posts.length !== 1 ? 's' : ''} today
            {blockerCount > 0 && (
              <span className="blocker-count"> · 🚨 {blockerCount} blocker{blockerCount !== 1 ? 's' : ''}</span>
            )}
          </p>
        </div>
        {weather && !weatherError && (
          <div className="weather">
            {getWeatherIcon(weather.weathercode)} {Math.round(weather.temperature)}°C — Nairobi
          </div>
        )}
        {weatherError && <div className="weather">🌍 Nairobi — weather unavailable</div>}
      </div>

      <div className="filter-bar">
        <input
          className="search-input"
          placeholder="🔍 Search updates..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={filterMember} onChange={e => setFilterMember(e.target.value)}>
          {TEAM_MEMBERS.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
        />
        {(filterMember !== 'All Members' || filterDate || search) && (
          <button
            className="clear-filter"
            onClick={() => { setFilterMember('All Members'); setFilterDate(''); setSearch(''); }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {loading && (
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <p>Loading team updates...</p>
        </div>
      )}

      {apiError && (
        <div className="alert error">
          ⚠️ Could not connect to the server. Retrying in 10 seconds...
        </div>
      )}

      {!loading && !apiError && posts.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🌅</div>
          <h3>No updates yet today</h3>
          <p>Be the first to post your standup and kick off the team's day!</p>
        </div>
      )}

      {!loading && !apiError && posts.length > 0 && filteredPosts.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No results found</h3>
          <p>Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      )}

      {filteredPosts.map(post => (
        <div key={post.id} className={`post-card ${post.has_blocker ? 'has-blocker' : ''}`}>
          {editingPost === post.id ? (
            <div className="edit-form">
              <div className="field">
                <label>Yesterday</label>
                <textarea
                  value={editForm.yesterday}
                  onChange={e => setEditForm({...editForm, yesterday: e.target.value})}
                />
              </div>
              <div className="field">
                <label>Today</label>
                <textarea
                  value={editForm.today}
                  onChange={e => setEditForm({...editForm, today: e.target.value})}
                />
              </div>
              <div className="field">
                <label>Blockers</label>
                <textarea
                  value={editForm.blockers}
                  onChange={e => setEditForm({...editForm, blockers: e.target.value})}
                />
              </div>
              <div className="field checkbox">
                <input
                  type="checkbox"
                  checked={editForm.has_blocker}
                  onChange={e => setEditForm({...editForm, has_blocker: e.target.checked})}
                  id={`blocker-${post.id}`}
                />
                <label htmlFor={`blocker-${post.id}`}>🚨 Flag as blocker</label>
              </div>
              <div className="edit-actions">
                <button className="save-btn" onClick={() => handleSaveEdit(post.id)}>
                  ✅ Save Changes
                </button>
                <button className="cancel-btn" onClick={() => setEditingPost(null)}>
                  ✕ Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="post-header">
                <span className="author">👤 {post.author}</span>
                <span className="timestamp">
                  🕐 {new Date(post.timestamp).toLocaleString()}
                </span>
                {post.has_blocker && <span className="blocker-badge">🚨 BLOCKER</span>}
                {post.author === currentUser && (
                  <button className="edit-btn" onClick={() => handleEdit(post)}>
                    ✏️ Edit
                  </button>
                )}
              </div>
              <div className="post-field">
                <strong>Yesterday:</strong> {post.yesterday}
              </div>
              <div className="post-field">
                <strong>Today:</strong> {post.today}
              </div>
              {post.blockers && (
                <div className="post-field blocker-text">
                  <strong>Blockers:</strong> {post.blockers}
                </div>
              )}
              {post.attachment && (
                <div className="post-field">
                  <a href={`https://standup-logger-backend.onrender.com${post.attachment}`}
                    target="_blank" rel="noreferrer">
                    📎 View Attachment
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Feed;