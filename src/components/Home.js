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
      flagComment: '',
      flagSubmitted: false,
      flaggedArticles: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showFlagUI = this.showFlagUI.bind(this);
    this.showFlagButton = this.showFlagButton.bind(this);
    this.showFlagSubmitConfirmation = this.showFlagSubmitConfirmation.bind(this);
    this.showFlaggedLinks = this.showFlaggedLinks.bind(this);
  }

  componentDidMount() {
    getCurrentUser().then((userId) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        var tab = tabs[0];
        var url = new URL(tab.url);
        var domain = url.hostname;

        axios.post("http://localhost:3000/flags/checkIfAlreadyFlaggedByUser", {
          link: url,
          user: userId
        }).then((response) => {
            console.log(response);
            if (response.data.flaggedByUser) {
              this.setState({flagSubmitted: true, flagUIShow: false, flagComment: ''})
            }
        }).catch((error) => {
            console.error(error);
        });
      });

      axios.post("http://localhost:3000/flags/getFlagsByUser", {
        user: userId
      }).then((response) => {
          console.log(response);
          this.setState({ flaggedArticles: response.data.flags })
      }).catch((error) => {
          console.error(error);
      });
    });
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
            this.setState({flagSubmitted: true, flagUIShow: false, flagComment: ''})
        }).catch((error) => {
            console.error(error);
        });
      });
    });
  }
  
  showFlagUI() {
    if (this.state.showFlagUI && !this.state.flagSubmitted) {
      return (
        <form onSubmit={this.handleSubmit} id="flagSubmitForm">
          <textarea placeholder="Enter comments regarding this article" name="flagComment" value={this.state.flagComment} onChange={this.handleChange} id="flagComment"></textarea>
          <div id="button_wrapper">
            <button id="cancel_button" onClick={() => this.setState({showFlagUI: false})}>Cancel</button>
            <input type="submit" value="Submit Flag" id="submit_button"></input>
          </div>
        </form>
      );
    }
  }

  showFlagButton() {
    if (!this.state.showFlagUI && !this.state.flagSubmitted) {
      return (
        <button onClick={() => this.setState({showFlagUI: true})}id="flag_button">Flag Article</button>
      );
    }
  }

  showFlagSubmitConfirmation() {
    if(this.state.flagSubmitted) {
      return (
        <div>
          <img src={"http://localhost:3000/images/Checkmark.svg"} id="checkmark"></img>
          <p id="flag_submission_confirmation">Flag has been submitted</p>
        </div>
      );
    }
  }

  showFlaggedLinks() {
    if (this.state.flaggedArticles.length > 0) {
      return this.state.flaggedArticles.map((flag,i) => (
        <li key={i} class="flaggedArticle">
          <a href={flag.linkUrl} target="_blank">{flag.domain}</a>
        </li>
      ));
    } else {
      return <p>You have not flagged any articles</p>
    }
  }

  render () {
    console.log(this.state);
    return (
      <div className="wrapper">
          <header>
            <h1>Fakeout</h1>
            <h3>CrowdSourcing Truth in Social Media</h3>
          </header>
          {this.showFlagButton()}
          {this.showFlagUI()}
          {this.showFlagSubmitConfirmation()}
          <hr></hr>
          <div id="stat_wrapper">
            <div class="stat">
              <p class="stat_number">50</p>
              <p class="stat_context">Followers</p>
            </div>
            <div class="stat">
              <p class="stat_number">{this.state.flaggedArticles.length}</p>
              <p class="stat_context">Flagged Articles</p>
            </div>
            <div class="stat">
              <p class="stat_number">20</p>
              <p class="stat_context">Upvotes</p>
            </div>
          </div>
          <hr></hr>
          <ul id="flaggedLinksContainer">
            <p id="flaggedLinksTitle">Recently Flagged Links</p>
            {this.showFlaggedLinks()}
          </ul>
          <hr></hr>
          <p class="built-with">Built with ❤️ in Singapore</p>
      </div>
    );
  }
}

export default Home;
