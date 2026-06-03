import React, { useState } from 'react';
import axios from 'axios';

const API = 'https://standup-logger-backend.onrender.com/api';

function StandupForm({ onPostSubmitted }) {
  const [form, setForm] = useState({
    author: '', yesterday: '', today: '', blockers: '', has_blocker: false
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.author.trim()) e.author = 'Name is required';
    if (!form.yesterday.trim()) e.yesterday = 'This field is required';
    if (!form.today.trim()) e.today = 'This field is required';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (file) data.append('attachment', file);
      await axios.post(`${API}/standups/`, data);
      setSuccess(true);
      setForm({ author: '', yesterday: '', today: '', blockers: '', has_blocker: false });
      setFile(null);
      setErrors({});
      if (onPostSubmitted) onPostSubmitted();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setErrors({ api: 'Failed to submit. Please try again.' });
    }
    setSubmitting(false);
  };

  return (
    <div className="card form-card">
      <h2>📝 Post Your Standup</h2>
      {success && <div className="alert success">✅ Standup posted successfully!</div>}
      {errors.api && <div className="alert error">{errors.api}</div>}
      <div className="field">
        <label>Your Name</label>
        <input value={form.author} onChange={e => setForm({...form, author: e.target.value})} placeholder="e.g. Jane Doe" />
        {errors.author && <span className="error-text">{errors.author}</span>}
      </div>
      <div className="field">
        <label>What did you do yesterday?</label>
        <textarea value={form.yesterday} onChange={e => setForm({...form, yesterday: e.target.value})} placeholder="Yesterday I worked on..." />
        {errors.yesterday && <span className="error-text">{errors.yesterday}</span>}
      </div>
      <div className="field">
        <label>What are you doing today?</label>
        <textarea value={form.today} onChange={e => setForm({...form, today: e.target.value})} placeholder="Today I will..." />
        {errors.today && <span className="error-text">{errors.today}</span>}
      </div>
      <div className="field">
        <label>Any blockers?</label>
        <textarea value={form.blockers} onChange={e => setForm({...form, blockers: e.target.value})} placeholder="I'm blocked by..." />
      </div>
      <div className="field checkbox">
        <input type="checkbox" checked={form.has_blocker} onChange={e => setForm({...form, has_blocker: e.target.checked})} id="blocker" />
        <label htmlFor="blocker">I have a blocker</label>
      </div>
      <div className="field">
        <label>Attach a file (optional)</label>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
      </div>
      <button onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Posting...' : 'Post Standup'}
      </button>
    </div>
  );
}

export default StandupForm;