import React, { Component } from 'react';

export default class Phase extends Component {
  constructor() {
    super();

    this.state = {
      phaseTitle: `Choose Template`,
      phaseTabName: `chooseTemplate`,
    }

    this.phaseTabs = {
      ChooseTemplate: {
        phaseTitle: 'Choose Template',
        phaseTabName: `chooseTemplate`,
        phaseTabValue: 1,
      },
      CustomizeVideo: {
        phaseTitle: 'Customize Video',
        phaseTabName: `customizeVideo`,
        phaseTabValue: 2,
      },
      PublishVideo: {
        phaseTitle: 'Publish & Video',
        phaseTabName: `publishVideoo`,
        phaseTabValue: 3,
      },
    }
  }

  render() {
    return (
      <div className="phase-component">
        {/* <PhaseTitle title={this.state} />
        <PhaseTabs />
        <PhaseContainer /> */}
        <div className="phase-state-title">
          <div>Choose Template</div>
        </div>
        <div className="phase-state-tabs">
          <div className="stepper">
            <div className="line"></div>
            <div className="gapped">
              <div className="phase">
                <div className="phase-label active">1</div>
              </div>
            </div>
            <div className="gapped">
              <div className="phase">
                <div className="phase-label">2</div>
              </div>
            </div>
            <div className="gapped">
              <div className="phase">
                <div className="phase-label">3</div>
              </div>
            </div>
          </div>
        </div>
        <div className="phase-state-container">Tab Container</div>
      </div>
    );
  }
}
