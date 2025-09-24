import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function CoursesList() {
  const { isInstructor } = useAuth();
  const BASE_URL = useMemo(() => process.env.REACT_APP_API_URL ?? 'http://localhost:5000', []);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingIds, setDeletingIds] = useState(new Set());

  const fetchCourses = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/courses`);
      setCourses(data ?? []);
    } catch (err) {
      console.error(err);
      setError('Failed to load courses');
    }
  }, [BASE_URL]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchCourses();
      setLoading(false);
    })();
  }, [fetchCourses]);

  const deleteCourse = async (id) => {
    if (!window.confirm('Delete this course? Assignments referencing it will keep its code.')) return;
    setDeletingIds(prev => new Set([...prev, id]));
    try {
      await axios.delete(`${BASE_URL}/courses/${id}`);
      setCourses(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    } finally {
      setDeletingIds(prev => { const next = new Set(prev); next.delete(id); return next; });
    }
  };

  if (loading) return <div>Loading…</div>;
  if (error) return <div className="alert alert-danger" role="alert">{error}</div>;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="mb-0">Courses</h3>
        {isInstructor && (
          <Link to="/courses/new" className="btn btn-primary btn-sm">Add Course</Link>
        )}
      </div>
      <table className="table table-sm">
        <thead>
          <tr>
            <th>Code</th>
            <th>Title</th>
            <th>Created</th>
            {isInstructor && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {courses.map(c => (
            <tr key={c.id}>
              <td>{c.code}</td>
              <td>{c.title}</td>
              <td>{c.createdAt?.substring(0,10)}</td>
              {isInstructor && (
                <td>
                  <button
                    className="btn btn-link p-0 align-baseline"
                    disabled={deletingIds.has(c.id)}
                    onClick={() => deleteCourse(c.id)}
                  >
                    {deletingIds.has(c.id) ? 'Deleting…' : 'delete'}
                  </button>
                </td>
              )}
            </tr>
          ))}
          {courses.length === 0 && (
            <tr>
              <td colSpan={isInstructor ? 4 : 3} className="text-center text-muted">No courses</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
