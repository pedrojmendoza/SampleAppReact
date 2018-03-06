import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import FeatureToggle from './FeatureToggle';
import SpainFeature from './SpainFeature';
import USFeature from './USFeature';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Version number="5"/>
        <FeatureToggle show={process.env.REACT_APP_ES_FEATURE === "true"}>
          <SpainFeature/>
        </FeatureToggle>
        <FeatureToggle show={process.env.REACT_APP_US_FEATURE === "true"}>
          <USFeature/>
        </FeatureToggle>
      </div>
    );
  }
}

function Version(props) {
  return <p>This is version {props.number}.</p>
}

export default App;
