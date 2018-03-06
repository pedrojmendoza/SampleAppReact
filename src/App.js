import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { FeatureToggleProvider, FeatureToggle } from 'react-feature-toggles';
import SpainFeature from './SpainFeature';
import USFeature from './USFeature';

const toggleNames = {
  SHOW_SPAIN: 'showSpain',
  SHOW_US: 'showUS'
  // ... add more here
};

const toggles = {
  // Try setting this to true
  [toggleNames.SHOW_SPAIN]: process.env.REACT_APP_ES_FEATURE === "true",
  [toggleNames.SHOW_US]: process.env.REACT_APP_US_FEATURE === "true"
  // ... add more here
};

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
        <FeatureToggleProvider featureToggleList={toggles}>
          <div>
            <FeatureToggle featureName={toggleNames.SHOW_SPAIN}>
              <SpainFeature/>
            </FeatureToggle>
            <FeatureToggle featureName={toggleNames.SHOW_US}>
              <USFeature/>
            </FeatureToggle>
          </div>
        </FeatureToggleProvider>
      </div>
    );
  }
}

function Version(props) {
  return <p>This is version {props.number}.</p>
}

export default App;
