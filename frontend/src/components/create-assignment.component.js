import React, { useEffect, useState, useMemo, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateAssignment() {
  const navigate = useNavigate();
  const BASE_URL = useMemo(() => process.env.REACT_APP_API_URL ?? 'http://localhost:5000', []);

  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [score, setScore] = useState('');
  const [date, setDate] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/users`);
        if (!cancelled && data.length > 0) {
          setUsers(data.map(u => u.username));
          setUsername(data[0].username);
        }
      } catch (err) {
        if (!cancelled) setError('Failed to load users');
        console.error(err);
      }
    })();
    return () => { cancelled = true; };
  }, [BASE_URL]);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const assignment = {
        username,
        description,
        score: Number(score) || 0,
        date,
      };
      await axios.post(`${BASE_URL}/assignments/add`, assignment);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to create assignment');
    } finally {
      setSubmitting(false);
    }
  }, [username, description, score, date, BASE_URL, navigate]);

  return (
    <div>
      <h3>Create New Assignments Log</h3>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Username: </label>
          <select
            required
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={submitting}
          >
            {users.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Description: </label>
          <input
            type="text"
            required
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label>Score: </label>
          <input
            type="number"
            className="form-control"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label>Date: </label>
          <div>
            <DatePicker selected={date} onChange={(d) => d && setDate(d)} />
          </div>
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Create Assignments Log'}
          </button>
        </div>
      </form>
    </div>
  );
}
