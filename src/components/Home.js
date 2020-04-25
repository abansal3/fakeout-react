/* global chrome */

import React, {Component} from 'react';
import '../stylesheets/Home.css';
import axios from 'axios';
import {getCurrentUser} from '../helper';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      flagUIShow: false,
      flagComment: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showFlagUI = this.showFlagUI.bind(this);
  }

  handleChange(event) {
    var target = event.target.name;
    this.setState({[target]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    getCurrentUser().then((userId) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        var tab = tabs[0];
        var url = new URL(tab.url);
        var domain = url.hostname;

        axios.post("http://localhost:3000/flags/flag", {
          link: url, 
          domain: domain, 
          isSuspicious: 1, 
          userId: userId,
          flagComment: this.state.flagComment
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.error(error);
        });
      });
    });
  }
  
  showFlagUI() {
    if (this.state.showFlagUI) {
      return (
        <form onSubmit={this.handleSubmit}>
          <textarea name="flagComment" value={this.state.flagComment} onChange={this.handleChange}></textarea>
          <input type="submit" value="Submit Flag"></input>
        </form>
      );
    }
  }

  render () {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Fakeout</h1>
          <h3>CrowdSourcing Truth in Social Media</h3>
          <button onClick={() => this.setState({showFlagUI: true})}>Flag this Website</button>
          {this.showFlagUI()}
        </header>
      </div>
    );
  }
}

export default Home;
