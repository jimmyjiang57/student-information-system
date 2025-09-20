import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Navbar from './components/navbar.component';
import AssignmentsList from './components/assignments-list.component';
import EditAssignment from './components/edit-assignment.component';
import CreateAssignment from './components/create-assignment.component';
import CreateUser from './components/create-user.component';
import Login from './components/login.component';
import { AuthProvider } from './context/AuthContext';
import { RequireAuth, InstructorOnly } from './components/route-guards';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container page-wrapper">
          <br />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<RequireAuth />}> {/* protected authenticated routes */}
              <Route path="/assignments" element={<AssignmentsList />} />
              <Route element={<InstructorOnly />}> {/* instructor-only */}
                <Route path="/edit/:id" element={<EditAssignment />} />
                <Route path="/create" element={<CreateAssignment />} />
                <Route path="/user" element={<CreateUser />} />
              </Route>
              {/* student has no access to instructor-only paths */}
            </Route>
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
