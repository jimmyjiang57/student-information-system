import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default class EditAssignment extends Component {
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
      score: 0,
      date: new Date(),
      users: []
    }
  }

  componentDidMount() {
  axios.get(`${process.env.REACT_APP_API_URL}/assignments/`+this.props.match.params.id)
      .then(response => {
        this.setState({
          username: response.data.username,
          description: response.data.description,
          score: response.data.score,
          date: new Date(response.data.date)
        })   
      })
      .catch(function (error) {
        console.log(error);
      })

  axios.get(`${process.env.REACT_APP_API_URL}/users`)
      .then(response => {
        if (response.data.length > 0) {
          this.setState({
            users: response.data.map(user => user.username),
          })
        }
      })
      .catch((error) => {
        console.log(error);
      })

  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    })
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    })
  }

  onChangeScore(e) {
    this.setState({
      score: e.target.value
    })
  }

  onChangeDate(date) {
    this.setState({
      date: date
    })
  }

  onSubmit = async (e) => {
  e.preventDefault();
  try {
    const assignments = {
      username: this.state.username,
      description: this.state.description,
      score: Number(this.state.score),
      date: this.state.date,
    };
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/assignments/${this.props.match.params.id}`,
      assignments
    );
    console.log(res.data);
    window.location = '/';
  } catch (err) {
    console.error(err?.response?.data || err.message);
    alert(err?.response?.data || 'Update failed');
  }
};

  render() {
    return (
    <div>
      <h3>Edit Assignments Log</h3>
      <form onSubmit={this.onSubmit}>
        <div className="form-group"> 
          <label>Username: </label>
          <select ref="userInput"
              required
              className="form-control"
              value={this.state.username}
              onChange={this.onChangeUsername}>
              {
                this.state.users.map(function(user) {
                  return <option 
                    key={user}
                    value={user}>{user}
                    </option>;
                })
              }
          </select>
        </div>
        <div className="form-group"> 
          <label>Description: </label>
          <input  type="text"
              required
              className="form-control"
              value={this.state.description}
              onChange={this.onChangeDescription}
              />
        </div>
        <div className="form-group">
          <label>Score: </label>
          <input 
              type="text" 
              className="form-control"
              value={this.state.score}
              onChange={this.onChangeScore}
              />
        </div>
        <div className="form-group">
          <label>Date: </label>
          <div>
            <DatePicker
              selected={this.state.date}
              onChange={this.onChangeDate}
            />
          </div>
        </div>

        <div className="form-group">
          <input type="submit" value="Edit Assignments Log" className="btn btn-primary" />
        </div>
      </form>
    </div>
    )
  }
}