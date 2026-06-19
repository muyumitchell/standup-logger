import React, { useState } from 'react';
import axios from 'axios';

const API = 'https://standup-logger-backend.onrender.com/api';

function StandupForm({ currentUser, onPostSubmitted }) {
  const [form, setForm] = useState({
    author: currentUser || '', yesterday: '', today: '', blockers: '', has_blocker: false
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.author.trim()) e.author = 'Please enter your name';
    if (!form.yesterday.trim()) e.yesterday = 'Please describe what you did yesterday';
    if (!form.today.trim()) e.today = 'Please describe what you are doing today';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('author', form.author);
      data.append('yesterday', form.yesterday);
      data.append('today', form.today);
      data.append('blockers', form.blockers);
      data.append('has_blocker', form.has_blocker);
      if (file) data.append('attachment', file);
      await axios.post(`${API}/standups/`, data);
      setSuccess(true);
      setForm({ author: currentUser || '', yesterday: '', today: '', blockers: '', has_blocker: false });
      setFile(null);
      setErrors({});
      if (onPostSubmitted) onPostSubmitted();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setErrors({ api: 'Failed to submit. Please check your connection and try again.' });
    }
    setSubmitting(false);
  };

  return (
    <div className="card form-card">
      <h2>📝 Post Your Standup</h2>
      <p className="form-subtitle">Share your daily update with the team</p>

      {success && (
        <div className="alert success">
          ✅ Standup posted! Your team can see your update.
        </div>
      )}
      {errors.api && <div className="alert error">⚠️ {errors.api}</div>}

      <div className="field">
        <label>Your Name</label>
        <input
          value={form.author}
          onChange={e => setForm({...form, author: e.target.value})}
          placeholder="Enter your name"
          className={errors.author ? 'error-input' : ''}
        />
        {errors.author && <span className="error-text">{errors.author}</span>}
      </div>

      <div className="field">
        <label>What did you do yesterday?</label>
        <textarea
          value={form.yesterday}
          onChange={e => setForm({...form, yesterday: e.target.value})}
          placeholder="e.g. Completed the login module and fixed two bugs..."
          className={errors.yesterday ? 'error-input' : ''}
        />
        {errors.yesterday && <span className="error-text">{errors.yesterday}</span>}
      </div>

      <div className="field">
        <label>What are you doing today?</label>
        <textarea
          value={form.today}
          onChange={e => setForm({...form, today: e.target.value})}
          placeholder="e.g. Working on the dashboard and writing unit tests..."
          className={errors.today ? 'error-input' : ''}
        />
        {errors.today && <span className="error-text">{errors.today}</span>}
      </div>

      <div className="field">
        <label>Any blockers? <span className="optional">(optional)</span></label>
        <textarea
          value={form.blockers}
          onChange={e => setForm({...form, blockers: e.target.value})}
          placeholder="e.g. Waiting for API credentials from the DevOps team..."
        />
      </div>

      <div className="field checkbox">
        <input
          type="checkbox"
          checked={form.has_blocker}
          onChange={e => setForm({...form, has_blocker: e.target.checked})}
          id="blocker"
        />
        <label htmlFor="blocker">🚨 Flag this as a blocker</label>
      </div>

      <div className="field">
        <label>Attach a file <span className="optional">(optional)</span></label>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        {file && <span className="file-name">📎 {file.name}</span>}
      </div>

      <button onClick={handleSubmit} disabled={submitting}>
        {submitting ? '⏳ Posting...' : '🚀 Post Standup'}
      </button>
    </div>
  );
}

export default StandupForm;