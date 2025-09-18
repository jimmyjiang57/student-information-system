import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

export default class CreateAssignment extends Component {
  constructor(props) {
    super(props);

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeScore = this.onChangeScore.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      username: '',
      description: '',
      score: '',
      date: new Date(),
      users: []
    };
  }

  componentDidMount() {
    // If you have an API helper for users, you can swap this later.
    axios
      .get(`${process.env.REACT_APP_API_URL ?? 'http://localhost:5000'}/users`)
      .then(response => {
        if (response.data.length > 0) {
          this.setState({
            users: response.data.map(user => user.username),
            username: response.data[0].username
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onChangeUsername(e) {
    this.setState({ username: e.target.value });
  }

  onChangeDescription(e) {
    this.setState({ description: e.target.value });
  }

  onChangeScore(e) {
    this.setState({ score: e.target.value });
  }

  onChangeDate(date) {
    this.setState({ date });
  }

  onSubmit(e) {
    e.preventDefault();

    const assignments = {
      username: this.state.username,
      description: this.state.description,
      score: Number(this.state.score) || 0,
      date: this.state.date,
    };

    axios
      .post(`${process.env.REACT_APP_API_URL ?? 'http://localhost:5000'}/assignments/add`, assignments)
      .then(res => {
        console.log(res.data);
        window.location = '/';
      })
      .catch(err => {
        console.error(err);
        // You could show an inline error here if you prefer not to redirect on failure
      });
  }

  render() {
    const { users, username, description, score, date } = this.state;

    return (
      <div>
        <h3>Create New Assignments Log</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Username: </label>
            <select
              required
              className="form-control"
              value={username}
              onChange={this.onChangeUsername}
            >
              {users.map((user) => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description: </label>
            <input
              type="text"
              required
              className="form-control"
              value={description}
              onChange={this.onChangeDescription}
            />
          </div>

          <div className="form-group">
            <label>
              Score:{' '}
            </label>
            <input
              type="text"
              className="form-control"
              value={score}
              onChange={this.onChangeScore}
            />
          </div>

          <div className="form-group">
            <label>Date: </label>
            <div>
              <DatePicker selected={date} onChange={this.onChangeDate} />
            </div>
          </div>

          <div className="form-group">
            <input type="submit" value="Create Assignments Log" className="btn btn-primary" />
          </div>
        </form>
      </div>
    );
  }
}
