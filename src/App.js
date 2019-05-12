import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Cookies from 'universal-cookie';

import DashboardScreen from './screens/DashboardScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import ThisYearScreen from './screens/ThisYearScreen';
import TotoMenu from './comp/TotoMenu';

import './App.css';

import googleLogo from './img/google-logo.png';

const cookies = new Cookies();

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      signedIn: false
    }

    window.gapi.load('auth2', () => {

      let auth = window.gapi.auth2.init({
        client_id: '209706877536-puv2rjnkai04et4jh371krm00t1n1st6.apps.googleusercontent.com'
      });

      // Check if the cookie is there
      let user = cookies.get('user');

      if (user != null) this.setState({ signedIn: true })
      else {
        // Try to signin with google
        let signedIn = auth.isSignedIn.get();
        this.setState({ signedIn: signedIn })
      }
    })

    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);

  }

  /**
   * Google sign in
   */
  signIn() {

    window.gapi.auth2.getAuthInstance().signIn().then((googleUser) => {

      let profile = googleUser.getBasicProfile();

      // Define the user
      let user = { name: profile.getName(), email: profile.getEmail() };

      // Set the cookies
      cookies.set('user', user, { path: '/' });

      // Update the state
      this.setState({ signedIn: true });

    }, (err) => { this.setState({ signedIn: false, error: err }) });
  }

  /**
   * Sign out
   */
  signOut() {

    window.gapi.auth2.getAuthInstance().signOut().then(() => {

      // Update the state
      this.setState({ signedIn: false })

      // Clear the cookies
      cookies.remove('user');
    });

  }

  render() {

    // Define the content  based on the sign in state
    let content = (
      <div className="toto-login" >
        <div className="toto-login-button" onClick={this.signIn}>
          <div className="sign-in">Login</div>
          <img className="logo" src={googleLogo} alt="google-logo" />
        </div>
      </div>
    );
    if (this.state.signedIn) content = (
      <div className="toto-app">
        <TotoMenu onSignOut={this.signOut}/>
        <Switch>
          <Route exact path='/' component={ExpensesScreen} />
          <Route exact path='/year' component={ThisYearScreen} />
          <Route exact path='/import' component={DashboardScreen} />
        </Switch>
      </div>
    )


    return (
      <Router>
        {content}
      </Router>
    );
  }
}

export default App;
