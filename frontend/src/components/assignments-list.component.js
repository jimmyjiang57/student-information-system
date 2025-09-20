import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AssignmentRow = ({ assignment, onDelete }) => (
  <tr>
    <td>{assignment.username}</td>
    <td>{assignment.description}</td>
    <td>{assignment.score}</td>
    <td>{assignment.date?.substring(0, 10)}</td>
    <td>
      <Link to={`/edit/${assignment.id}`}>edit</Link>{' '}
      |{' '}
      <button
        type="button"
        className="btn btn-link p-0 align-baseline"
        onClick={() => onDelete(assignment.id)}
      >
        delete
      </button>
    </td>
  </tr>
);

export default function AssignmentsList() {
  const BASE_URL = useMemo(() => process.env.REACT_APP_API_URL ?? 'http://localhost:5000', []);

  const [assignments, setAssignments] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssignments = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/assignments`);
      setAssignments(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load assignments');
    }
  }, [BASE_URL]);

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/users`);
      setUsers(data);
      if (data.length > 0) {
        setSelectedUser(prev => prev || data[0].username);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load users');
    }
  }, [BASE_URL]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchAssignments()]);
      setLoading(false);
    })();
  }, [fetchUsers, fetchAssignments]);

  const deleteAssignment = useCallback(async (id) => {
    try {
      await axios.delete(`${BASE_URL}/assignments/${id}`);
      setAssignments(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
      setError('Delete failed');
    }
  }, [BASE_URL]);

  const filteredAssignments = assignments.filter(a => !selectedUser || a.username === selectedUser);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger" role="alert">{error}</div>;

  return (
    <div>
      <h3>Logged Assignments</h3>
      <div className="form-group">
        <label>Filter by user: </label>
        <select
          required
          className="form-control"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          {users.map(user => (
            <option key={user._id || user.id || user.username} value={user.username}>
              {user.username}
            </option>
          ))}
        </select>
      </div>
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Score</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssignments.map(a => (
            <AssignmentRow key={a.id} assignment={a} onDelete={deleteAssignment} />
          ))}
          {filteredAssignments.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center text-muted">
                No assignments for selected user
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}