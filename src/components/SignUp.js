/* global chrome */

import React, {Component} from 'react';
import '../stylesheets/App.css';
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
    }).then((response) => {
        console.log(response);

        this.props.getRouteCallback('SignIn');
    }).catch((error) => {
        console.error(error);
    });
  }

  render () {
    return (
      <div className="wrapper">
          <header>
            <h1>Fakeout</h1>
            <h3>CrowdSourcing Truth in Social Media</h3>
          </header>
          <form onSubmit={this.handleSubmit} class="authenticationForm">
            <input name="email" type="email" placeholder="Email" value={this.state.email} onChange={this.handleChange}></input>
            <input name="password" type="password" placeholder="Password" value={this.state.password} onChange={this.handleChange}></input>
            <input type="submit" value="Sign Up"></input>
          </form>
          <p class="built-with">Built with ❤️ in Singapore</p>
      </div>
    );
  }
}

export default SignUp;
