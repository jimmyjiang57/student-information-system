import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';

export default function CreateUser() {
  const BASE_URL = useMemo(() => process.env.REACT_APP_API_URL ?? 'http://localhost:5000', []);

  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/users`);
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [BASE_URL]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await axios.post(`${BASE_URL}/users/add`, { username });
      setUsername('');
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError('Failed to create user');
    } finally {
      setSubmitting(false);
    }
  }, [username, BASE_URL, fetchUsers]);

  const deleteUser = useCallback(async (id) => {
    try {
      await axios.delete(`${BASE_URL}/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete user');
    }
  }, [BASE_URL]);

  return (
    <div>
      <h3>Create New User</h3>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Username: </label>
          <input
            type="text"
            required
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={submitting}
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>

      <div className="mt-4">
        <h3>Users List</h3>
        {loading ? (
          <div>Loading users...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="btn btn-danger btn-sm"
                      type="button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center text-muted">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}