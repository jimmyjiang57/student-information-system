import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Navbar from './components/navbar.component';
import AssignmentsList from './components/assignments-list.component';
import EditAssignment from './components/edit-assignment.component';
import CreateAssignment from './components/create-assignment.component';
import CoursesList from './components/courses-list.component';
import CreateCourse from './components/create-course.component';
import CreateUser from './components/create-user.component';
import Login from './components/login.component';
import { AuthProvider } from './context/AuthContext';
import { RequireAuth, InstructorOnly } from './components/route-guards';

function PageWrapperLayout() {
  return (
    <div className="container page-wrapper">
      <br />
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Protected routes are wrapped once via layout route */}
          <Route element={<RequireAuth />}> {/* protected authenticated routes */}
            <Route element={<PageWrapperLayout />}> {/* adds bordered container only here */}
              <Route path="/assignments" element={<AssignmentsList />} />
              <Route element={<InstructorOnly />}>
                <Route path="/edit/:id" element={<EditAssignment />} />
                <Route path="/create" element={<CreateAssignment />} />
                <Route path="/user" element={<CreateUser />} />
                <Route path="/courses" element={<CoursesList />} />
                <Route path="/courses/new" element={<CreateCourse />} />
              </Route>
            </Route>
          </Route>

          <Route element={<PageWrapperLayout />}>
            <Route path="*" element={<div>Not Found</div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
