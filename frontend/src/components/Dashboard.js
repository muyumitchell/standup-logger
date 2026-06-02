import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const API = 'http://127.0.0.1:8000/api';

function Dashboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API}/standups/stats/`);
        setStats(res.data);
        setError(false);
      } catch {
        setError(true);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const totalPosts = stats.reduce((sum, d) => sum + d.post_count, 0);
  const totalBlockers = stats.reduce((sum, d) => sum + d.blocker_count, 0);
  const activeDays = stats.filter(d => d.post_count > 0).length;

  return (
    <div className="dashboard">
      <h2>📊 Productivity Dashboard</h2>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-number">{totalPosts}</span>
          <span className="stat-label">Posts This Week</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{totalBlockers}</span>
          <span className="stat-label">Blockers Reported</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{activeDays}</span>
          <span className="stat-label">Active Days</span>
        </div>
      </div>

      {loading && <p>Loading chart...</p>}
      {error && <div className="alert error">⚠️ Could not load stats.</div>}

      {!loading && !error && (
        <div className="chart-container">
          <h3>Posts & Blockers — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="post_count" name="Posts" fill="#4f46e5" radius={[4,4,0,0]} />
              <Bar dataKey="blocker_count" name="Blockers" fill="#ef4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default Dashboard;