import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { role, isInstructor, isStudent, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
      <div className="container">
        <Link to={role ? '/assignments' : '/'} className="navbar-brand">GradeFlow</Link>
        <div className="collapse navbar-collapse show">
          {role && (
            <ul className="navbar-nav mr-auto">
              {isInstructor && (
                <>
                  <li className="nav-item">
                    <NavLink to="/assignments" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Assignments</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/create" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Add Assignment</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/user" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Manage Students</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/courses" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Courses</NavLink>
                  </li>
                </>
              )}
            </ul>
          )}
          <ul className="navbar-nav ms-auto">
            {isStudent && (
              <li className="nav-item"><span className="navbar-text text-light small me-3">Student</span></li>
            )}
            {isInstructor && (
              <li className="nav-item"><span className="navbar-text text-light small me-3">Instructor</span></li>
            )}
            {role ? (
              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </nav>
  );
}