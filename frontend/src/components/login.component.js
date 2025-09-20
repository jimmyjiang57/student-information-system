import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { role, login, isInstructor } = useAuth();
  const BASE_URL = useMemo(() => process.env.REACT_APP_API_URL ?? 'http://localhost:5000', []);

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (role) {
      // Already logged in
      navigate('/assignments');
    }
  }, [role, navigate]);

  useEffect(() => {
    if (selectedRole === 'student') {
      setLoadingUsers(true);
      axios.get(`${BASE_URL}/users`)
        .then(res => {
          setUsers(res.data);
          if (res.data.length > 0) setSelectedStudent(res.data[0].username);
        })
        .catch(err => {
          console.error(err);
          setError('Failed to load users');
        })
        .finally(() => setLoadingUsers(false));
    }
  }, [selectedRole, BASE_URL]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRole) return;
    if (selectedRole === 'student' && !selectedStudent) return;
    login(selectedRole, selectedRole === 'student' ? selectedStudent : null);
    navigate('/assignments');
  };

  return (
    <div className="mt-4" style={{ maxWidth: 480 }}>
      <h2>Select Role</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label className="form-label">Role:</label>
          <select
            className="form-control"
            value={selectedRole}
            onChange={(e) => { setSelectedRole(e.target.value); setSelectedStudent(''); }}
          >
            <option value="">-- Choose --</option>
            <option value="instructor">Instructor</option>
            <option value="student">Student</option>
          </select>
        </div>

        {selectedRole === 'student' && (
          <div className="form-group mb-3">
            <label className="form-label">Student:</label>
            {loadingUsers ? (
              <div>Loading students...</div>
            ) : (
              <select
                className="form-control"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                {users.map(u => (
                  <option key={u.id || u._id || u.username} value={u.username}>{u.username}</option>
                ))}
              </select>
            )}
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={!selectedRole || (selectedRole === 'student' && !selectedStudent)}>
          Continue
        </button>
      </form>
      {isInstructor && (
        <p className="text-muted small mt-3 mb-0">You are logged in as Instructor.</p>
      )}
    </div>
  );
}
