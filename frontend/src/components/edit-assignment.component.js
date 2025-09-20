import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useNavigate } from 'react-router-dom';

export default function EditAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const BASE_URL = useMemo(
    () => process.env.REACT_APP_API_URL ?? 'http://localhost:5000',
    []
  );

  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [score, setScore] = useState(0);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState(null);

  // load assignment + users
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [assignmentRes, usersRes] = await Promise.all([
          axios.get(`${BASE_URL}/assignments/${id}`),
          axios.get(`${BASE_URL}/users`),
        ]);

        if (cancelled) return;

        const a = assignmentRes.data ?? {};
        setUsername(a.username ?? '');
        setDescription(a.description ?? '');
        setScore(Number(a.score ?? 0));
        setDate(a.date ? new Date(a.date) : new Date());

        const names = (usersRes.data ?? [])
          .map(u => u.username)
          .filter(Boolean);
        setUsers(names);
      } catch (e) {
        console.error(e);
        setErrMsg('Failed to load assignment or users.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [BASE_URL, id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        username,
        description,
        score: Number(score) || 0,
        date: date instanceof Date ? date.toISOString() : date,
      };
      const res = await axios.put(`${BASE_URL}/assignments/${id}`, payload);
      console.log(res.data);
      navigate('/');
    } catch (err) {
      console.error(err?.response?.data || err.message);
      setErrMsg(err?.response?.data || 'Update failed');
      alert(err?.response?.data || 'Update failed');
    }
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div>
      <h3>Edit Assignments Log</h3>

      {errMsg && (
        <div className="alert alert-danger" role="alert" style={{ marginBottom: 16 }}>
          {errMsg}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Username: </label>
          <select
            required
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          >
            {users.map((u) => (
              <option key={u} value={u}>{u}</option>
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
          />
        </div>

        <div className="form-group">
          <label>Score: </label>
          <input
            type="number"
            className="form-control"
            value={String(score)}
            onChange={(e) => setScore(e.target.value)}
            step="1"
            min="0"
            inputMode="numeric"
          />
        </div>

        <div className="form-group">
          <label>Date: </label>
          <div>
            <DatePicker selected={date} onChange={setDate} />
          </div>
        </div>

        <div className="form-group">
          <input type="submit" value="Edit Assignments Log" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
}
