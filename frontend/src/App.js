import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Navbar from "./components/navbar.component"
import AssignmentsList from "./components/assignments-list.component";
import EditAssignment from "./components/edit-assignment.component";
import CreateAssignment from "./components/create-assignment.component";
import CreateUser from "./components/create-user.component";

function App() {
  return (
    <Router>
        <Navbar />
      <div className="container page-wrapper">
        <br/>
        <Switch>
          <Route exact path="/" component={AssignmentsList} />
          <Route path="/edit/:id" component={EditAssignment} />
          <Route path="/create" component={CreateAssignment} />
          <Route path="/user" component={CreateUser} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
