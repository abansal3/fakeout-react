/* global chrome */

import React, {Component} from 'react';
import '../stylesheets/App.css';
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
    this.showFlagButton = this.showFlagButton.bind(this);
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
        <form onSubmit={this.handleSubmit} id="flagSubmitForm">
          <textarea name="flagComment" value={this.state.flagComment} onChange={this.handleChange} id="flagComment"></textarea>
          <div id="button_wrapper">
            <button id="cancel_button" onClick={() => this.setState({showFlagUI: false})}>Cancel</button>
            <input type="submit" value="Submit Flag" id="submit_button"></input>
          </div>
        </form>
      );
    }
  }

  showFlagButton() {
    if (!this.state.showFlagUI) {
      return (
        <button onClick={() => this.setState({showFlagUI: true})}id="flag_button">Flag this Website</button>
      )
    }
  }

  render () {
    return (
      <div className="wrapper">
          <header>
            <h1>Fakeout</h1>
            <h3>CrowdSourcing Truth in Social Media</h3>
          </header>
          {this.showFlagButton()}
          {this.showFlagUI()}
          <hr></hr>
          <div id="stat_wrapper">
            <div class="stat">
              <p class="stat_number">50</p>
              <p class="stat_context">Followers</p>
            </div>
            <div class="stat">
              <p class="stat_number">100</p>
              <p class="stat_context">Flagged Articles</p>
            </div>
            <div class="stat">
              <p class="stat_number">20</p>
              <p class="stat_context">Upvotes</p>
            </div>
          </div>
          <hr></hr>
          <p class="built-with">Built with ❤️ in Singapore</p>
      </div>
    );
  }
}

export default Home;
