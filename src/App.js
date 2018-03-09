import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import FeatureToggle from './FeatureToggle';
import SpainWizard from './SpainWizard';
import UsWizard from './UsWizard';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <FeatureToggle show={process.env.REACT_APP_ES_FEATURE === "true"}>
          <SpainWizard/>
        </FeatureToggle>
        <FeatureToggle show={process.env.REACT_APP_US_FEATURE === "true"}>
          <UsWizard/>
        </FeatureToggle>
      </div>
    );
  }
}

export default App;
