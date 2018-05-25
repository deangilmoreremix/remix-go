import React, { Component } from 'react';

export default class PhaseView extends Component {
  constructor() {
    super();
    this.state = {
      phaseTitle: 'Choose Template',
    };
  }

  render() {
    let { phaserElements } = this.props;
    let { phaseTitle } = this.state;


    const phaseHasChanged = (selectedTab) => {
      let title;
      const updated = phaserElements.map((element) => {
        const { selected, phaseTabValue } = element;
        if (selected && phaseTabValue !== selectedTab) element.selected = false;
        if (phaseTabValue === selectedTab) {
          element.selected = true;
          title = element.phaseTitle;
        }
        return element;
      });
      this.setState({ phaseTitle: title });
      phaserElements = [...updated];
    };

    const Phases = (props) => {
      const { onPhaseChanged, phases } = props;
      const phaseTabs = phases.map((element) => {
        const { phaseTitle, phaseTabValue, selected } = element;
        return (
          <div className={`stepper-tab-group ${(selected?'active':'')}`} key={phaseTabValue} id={`phase${phaseTabValue}`} >
            <div className="gapped">
              <div className="phase">
                <div className="phase-label" onClick={() => onPhaseChanged(phaseTabValue)}>{phaseTabValue}</div>
              </div>
            </div>
            <div className="stepper-tab-label">{phaseTitle}</div>
          </div>
        );
      });
      return (phaseTabs);
    };

    return (
      <div className="phase-component">
        <div className="phase-state-title">
          <div>{phaseTitle}</div>
        </div>
        <div className="phase-state-tabs">
          <div className="stepper">
            <div className="line"></div>
            <Phases phases={phaserElements} onPhaseChanged={(event) => phaseHasChanged(event)} />
          </div>
        </div>
      </div>
    );
  }
}
