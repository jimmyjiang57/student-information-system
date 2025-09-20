import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Navbar from "./components/navbar.component";
import AssignmentsList from "./components/assignments-list.component";
import EditAssignment from "./components/edit-assignment.component";
import CreateAssignment from "./components/create-assignment.component";
import CreateUser from "./components/create-user.component";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container page-wrapper">
        <br />
        <Routes>
          <Route path="/" element={<AssignmentsList />} />
          <Route path="/edit/:id" element={<EditAssignment />} />
          <Route path="/create" element={<CreateAssignment />} />
          <Route path="/user" element={<CreateUser />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
