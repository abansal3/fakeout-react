/* global chrome */

import React, {Component} from 'react';
import logo from './logo.svg';
import './stylesheets/App.css';
import {getCurrentUser} from './helper';

import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Home from './components/Home';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPage: "SignIn"
    }

    this.routeCallback = this.routeCallback.bind(this);
  }

  routeCallback(route) {
    this.setState({ currentPage: route});
  }

  componentDidMount() {
    getCurrentUser()
    .then((userId) => {
      if (userId) {
        console.log(userId);
        this.setState({ currentPage: "Home" });
      }
    })
    .catch((error) => {
      console.error("No user logged in")
    })
  }

  render () {
    switch (this.state.currentPage) {
      case 'SignUp':
        return <SignUp getRouteCallback = {this.routeCallback}/>
      case 'SignIn':
        return <SignIn getRouteCallback = {this.routeCallback} />
      case 'Home':
        return <Home getRouteCallback = {this.routeCallback} />
    }
  }
}

export default App;
