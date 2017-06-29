import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  feelingLucky() {
    window.TMIdentity.init({
      serverUrl: 'https://dev1.identity.nonprod-tmaws.io',
      flags: {
        social: true
      }
    }).then(window.TMIdentity.login);
  }

  render() {
    return (
      <div className="App">
        <p className="App-intro">
          <button className="btn btn-primary" onClick={this.feelingLucky}>I'm feeeeling lukcy!</button>
        </p>
      </div>
    );
  }
}

export default App;
