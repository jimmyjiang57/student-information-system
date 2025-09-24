import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AssignmentRow = ({ assignment, onDelete, canManage }) => (
  <tr>
    <td>{assignment.username}</td>
    <td>{assignment.courseCode || <span className="text-muted">—</span>}</td>
    <td>{assignment.description}</td>
    <td>{assignment.score}</td>
    <td>{assignment.date?.substring(0, 10)}</td>
    <td>
      {canManage ? (
        <>
          <Link to={`/edit/${assignment.id}`}>edit</Link>{' '}|{' '}
          <button
            type="button"
            className="btn btn-link p-0 align-baseline"
            onClick={() => onDelete(assignment.id)}
          >
            delete
          </button>
        </>
      ) : (
        <span className="text-muted">—</span>
      )}
    </td>
  </tr>
);

export default function AssignmentsList() {
  const { isStudent, isInstructor, username: studentUsername } = useAuth();
  const BASE_URL = useMemo(() => process.env.REACT_APP_API_URL ?? 'http://localhost:5000', []);

  const [assignments, setAssignments] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
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
    if (isStudent) return;
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
  }, [BASE_URL, isStudent]);

  const fetchCourses = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/courses`);
      setCourses(data ?? []);
    } catch (err) {
      console.warn('Failed to load courses');
    }
  }, [BASE_URL]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchAssignments(), fetchUsers(), fetchCourses()]);
      if (isStudent && studentUsername) {
        setSelectedUser(studentUsername);
      }
      setLoading(false);
    })();
  }, [fetchAssignments, fetchUsers, fetchCourses, isStudent, studentUsername]);

  const deleteAssignment = useCallback(async (id) => {
    try {
      await axios.delete(`${BASE_URL}/assignments/${id}`);
      setAssignments(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
      setError('Delete failed');
    }
  }, [BASE_URL]);

  const effectiveUser = isStudent ? studentUsername : selectedUser;
  const filteredAssignments = assignments
    .filter(a => !effectiveUser || a.username === effectiveUser)
    .filter(a => !selectedCourse || a.courseCode === selectedCourse);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger" role="alert">{error}</div>;

  return (
    <div>
      <h3>Assignments</h3>
      {isInstructor && (
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
      )}
      <div className="form-group">
        <label>Filter by course: </label>
        <select
          className="form-control"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">All courses</option>
          {courses.map(c => (
            <option key={c.id} value={c.code}>{c.code}</option>
          ))}
        </select>
      </div>
      
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>Name</th>
            <th>Course</th>
            <th>Description</th>
            <th>Score</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssignments.map(a => (
            <AssignmentRow key={a.id} assignment={a} onDelete={deleteAssignment} canManage={isInstructor} />
          ))}
          {filteredAssignments.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center text-muted">
                No assignments
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}