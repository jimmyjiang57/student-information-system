import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { role, login } = useAuth();
  const BASE_URL = useMemo(() => process.env.REACT_APP_API_URL ?? 'http://localhost:5000', []);

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (role) navigate('/assignments');
  }, [role, navigate]);

  useEffect(() => {
    if (selectedRole === 'student') {
      setLoadingUsers(true);
      setError(null);
      axios.get(`${BASE_URL}/users`)
        .then(res => {
          const data = Array.isArray(res.data) ? res.data : [];
          setUsers(data);
          setSelectedStudent(data.length ? data[0].username : '');
        })
        .catch(() => setError('Failed to load users'))
        .finally(() => setLoadingUsers(false));
    } else {
      setSelectedStudent('');
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
    <div className="container" style={{ maxWidth: 520 }}>
      <div className="card shadow-sm mt-4">
        <div className="card-header login-header">
          <h5 className="mb-0">Log In</h5>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-control"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">-- Choose --</option>
                <option value="instructor">Instructor</option>
                <option value="student">Student</option>
              </select>
            </div>

            {selectedRole === 'student' && (
              <div className="mb-3">
                <label className="form-label">Student</label>
                {loadingUsers ? (
                  <div className="form-text">Loading students…</div>
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
                {!loadingUsers && selectedRole === 'student' && users.length === 0 && (
                  <div className="form-text text-warning">No users found. Ask an instructor to add one.</div>
                )}
              </div>
            )}

            <div className="d-grid">
              <button type="submit" className="btn btn-primary" disabled={!selectedRole || (selectedRole === 'student' && !selectedStudent)}>
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
