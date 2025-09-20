import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
      <div className="container">
        <Link to="/" className="navbar-brand">GradeFlow</Link>
        <div className="collapse navbar-collapse show">{}
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Assignments</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/create" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Add Assignment</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/user" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Manage Students</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}