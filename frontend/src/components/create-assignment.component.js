import React, { useEffect, useState, useMemo, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CreateAssignment() {
  const navigate = useNavigate();
  const { isStudent, username: studentUsername } = useAuth();
  const BASE_URL = useMemo(() => process.env.REACT_APP_API_URL ?? 'http://localhost:5000', []);

  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [score, setScore] = useState('');
  const [date, setDate] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseCode, setCourseCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (isStudent) {
          setUsername(studentUsername || '');
        } else {
          const { data } = await axios.get(`${BASE_URL}/users`);
          if (!cancelled && data.length > 0) {
            setUsers(data.map(u => u.username));
            setUsername(data[0].username);
          }
        }
        try {
          const coursesRes = await axios.get(`${BASE_URL}/courses`);
          if (!cancelled) setCourses(coursesRes.data ?? []);
        } catch (e) {
          console.warn('Failed to load courses (optional)', e);
        }
      } catch (err) {
        if (!cancelled) setError('Failed to load users');
        console.error(err);
      }
    })();
    return () => { cancelled = true; };
  }, [BASE_URL, isStudent, studentUsername]);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const assignment = {
        username: isStudent ? studentUsername : username,
        description,
        score: Number(score) || 0,
        date,
        courseCode: courseCode || null,
      };
      await axios.post(`${BASE_URL}/assignments/add`, assignment);
      navigate('/assignments');
    } catch (err) {
      console.error(err);
      setError('Failed to create assignment');
    } finally {
      setSubmitting(false);
    }
  }, [username, description, score, date, courseCode, BASE_URL, navigate, isStudent, studentUsername]);

  return (
    <div>
      <h3>Add New Assignment</h3>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Username: </label>
          {isStudent ? (
            <input type="text" className="form-control" value={studentUsername || ''} disabled />
          ) : (
            <select
              required
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={submitting || isStudent}
            >
              {users.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label>Course: </label>
          <select
            className="form-control"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            disabled={submitting}
          >
            <option value="">(none)</option>
            {courses.map(c => (
              <option key={c.id || c.code} value={c.code}>{c.code} — {c.title}</option>
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
            {submitting ? 'Saving...' : 'Create Assignment'}
          </button>
        </div>
      </form>
    </div>
  );
}
