import React, { Component } from 'react';
import axios from 'axios';

export default class CreateUser extends Component {
  constructor(props) {
    super(props);

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.deleteUser = this.deleteUser.bind(this);

    this.state = {
      username: '',
      users: []
    }
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers() {
  axios.get(`${process.env.REACT_APP_API_URL}/users`)
      .then(response => {
        this.setState({ users: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    })
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      username: this.state.username
    }

  axios.post(`${process.env.REACT_APP_API_URL}/users/add`, user)
      .then(res => {
        console.log(res.data);
        this.setState({ username: '' });
        this.fetchUsers();
      });
  }

  deleteUser(id) {
  axios.delete(`${process.env.REACT_APP_API_URL}/users/${id}`)
      .then(res => {
        console.log(res.data);
        this.setState({
          users: this.state.users.filter(user => user.id !== id)
        });
      });
  }

  render() {
    return (
      <div>
        <h3>Create New User</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group"> 
            <label>Username: </label>
            <input  type="text"
                required
                className="form-control"
                value={this.state.username}
                onChange={this.onChangeUsername}
                />
          </div>
          <div className="form-group">
            <input type="submit" value="Create User" className="btn btn-primary" />
          </div>
        </form>

        <div className="mt-4">
          <h3>Users List</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.users.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>
                    <button onClick={() => this.deleteUser(user.id)} 
                            className="btn btn-danger btn-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}