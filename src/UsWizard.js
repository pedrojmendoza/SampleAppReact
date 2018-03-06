import React, { Component } from 'react';
import StepZilla from 'react-stepzilla'
import WelcomeStep from './WelcomeStep'
import UsComplianceStep from './UsComplianceStep'
import YetAnotherStep from './YetAnotherStep'

class UsWizard extends Component {
  render() {
    const steps =
    [
      {name: 'Step1', component: <WelcomeStep/>},
      {name: 'Step2', component: <YetAnotherStep/>},
      {name: 'Step3', component: <UsComplianceStep/>}
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

export default UsWizard;
