import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateCourse() {
  const navigate = useNavigate();
  const BASE_URL = useMemo(() => process.env.REACT_APP_API_URL ?? 'http://localhost:5000', []);

  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = { code: code.trim(), title: title.trim() };
      if (!payload.code || !payload.title) {
        setError('Both code and title are required');
        setSubmitting(false);
        return;
      }
      await axios.post(`${BASE_URL}/courses/add`, payload);
      navigate('/courses');
    } catch (err) {
      console.error(err);
      setError(err?.response?.data || 'Failed to create course (code must be unique)');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h3>Create Course</h3>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Course Code (unique): </label>
            <input
              type="text"
              required
              className="form-control"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={submitting}
              placeholder="e.g. CS101"
            />
        </div>
        <div className="form-group">
          <label>Title: </label>
            <input
              type="text"
              required
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
              placeholder="e.g. Intro to Computer Science"
            />
        </div>
        <div className="form-group">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create Course'}
          </button>{' '}
          <button type="button" className="btn btn-secondary" disabled={submitting} onClick={() => navigate('/courses')}>Cancel</button>
        </div>
      </form>
      <p className="text-muted small mb-0">After creating a course you can associate assignments with it.</p>
    </div>
  );
}
