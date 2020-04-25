/* global chrome */

import React, {Component} from 'react';
import '../stylesheets/SignUp.css';
import axios from 'axios';

class SignUp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    var target = event.target.name;
    this.setState({[target]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    axios.post("http://localhost:3000/users/signup", {
        email: this.state.email,
        password: this.state.password
    }).then(function(response) {
        console.log(response);
    }).catch(function(error) {
        console.error(error);
    });
  }

  render () {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Fakeout</h1>
          <h3>CrowdSourcing Truth in Social Media</h3>
          <form onSubmit={this.handleSubmit}>
            <input name="email" type="email" value={this.state.email} onChange={this.handleChange}></input>
            <input name="password" type="password" value={this.state.password} onChange={this.handleChange}></input>
            <input type="submit" value="Sign Up"></input>
          </form>
        </header>
      </div>
    );
  }
}

export default SignUp;
