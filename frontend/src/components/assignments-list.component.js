import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Assignment = props => (
  <tr>
    <td>{props.assignment.username}</td>
    <td>{props.assignment.description}</td>
    <td>{props.assignment.score}</td>
    <td>{props.assignment.date.substring(0,10)}</td>
    <td>
      <Link to={"/edit/"+props.assignment.id}>edit</Link> | <a href="#" onClick={() => { props.deleteAssignment(props.assignment.id) }}>delete</a>
    </td>
  </tr>
)

export default class AssignmentList extends Component {
  constructor(props) {
    super(props);

    this.deleteAssignment = this.deleteAssignment.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);

    this.state = {
      assignments: [],
      users: [],
      selectedUser: ''
    };
  }

  componentDidMount() {
    // Fetch all users
    axios.get(`${process.env.REACT_APP_API_URL}/users`)
      .then(response => {
        this.setState({ users: response.data });
        if (response.data.length > 0) {
          this.setState({ selectedUser: response.data[0].username }, this.fetchAssignments);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  fetchAssignments() {
    axios.get(`${process.env.REACT_APP_API_URL}/assignments`)
      .then(response => {
        this.setState({ assignments: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  deleteAssignment(id) {
    axios.delete(`${process.env.REACT_APP_API_URL}/assignments/`+id)
      .then(response => { console.log(response.data) });

    this.setState({
  assignments: this.state.assignments.filter(el => el.id !== id)
    })
  }

  handleUserChange(e) {
    this.setState({ selectedUser: e.target.value });
  }

  assignmentsList() {
    return this.state.assignments
      .filter(assignment => assignment.username === this.state.selectedUser)
      .map(currentAssignment => {
  return <Assignment assignment={currentAssignment} deleteAssignment={this.deleteAssignment} key={currentAssignment.id}/>;
      })
  }

  render() {
    return (
      <div>
      <h3>Logged Assignments</h3>
        <div className="form-group">
          <label>Filter by user: </label>
          <select
            required
            className="form-control"
            value={this.state.selectedUser}
            onChange={this.handleUserChange}
          >
            {this.state.users.map(user => (
              <option key={user._id} value={user.username}>
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
            { this.assignmentsList() }
          </tbody>
        </table>
      </div>
    )
  }
}