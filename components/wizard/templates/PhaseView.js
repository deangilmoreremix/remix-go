import React, { Component } from 'react';
import index from 'react-masonry-infinite/lib';

export default class PhaseView extends Component {
  constructor() {
    super();
    this.state = {
      phaseTitle: 'Choose Template',
    };
  }

  render() {
    let { phaserElements } = this.props;
    let currentTitle = this.state.phaseTitle;


    const phaseHasChanged = (selectedTab) => {
      let title;
      let indexKey = 0;
      const updated = phaserElements.map((element) => {
        indexKey += 1;
        const { selected, phaseTitle } = element;
        if (selected && phaseTitle !== selectedTab.phaseTitle) element.selected = false;
        if (phaseTitle === selectedTab.phaseTitle) {
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
      let indexKey = 0;
      const phaseTabs = phases.map((element) => {
        const { phaseTitle, phaseTabValue, selected } = element;
        indexKey += 1;
        return (
          <div className={`stepper-tab-group ${(selected?'active':'')}`} key={indexKey} >
            <div className="gapped">
              <div className="phase">
                <div className="phase-label" onClick={() => onPhaseChanged(element)}>{indexKey}</div>
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
          <div>{currentTitle}</div>
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
