import React, { Component } from 'react';
import StepZilla from 'react-stepzilla'
import WelcomeStep from './WelcomeStep'
import SpainComplianceStep from './SpainComplianceStep'
import YetAnotherStep from './YetAnotherStep'

class SpainWizard extends Component {
  render() {
    const steps =
    [
      {name: 'Step1', component: <WelcomeStep/>},
      {name: 'Step2', component: <SpainComplianceStep/>},
      {name: 'Step3', component: <YetAnotherStep/>}
    ]

    return (
      <div>
        <StepZilla
          steps={steps}
          showSteps={false}
         />
      </div>
    )
  }
}

export default SpainWizard;
