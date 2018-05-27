import React, { Component } from 'react';

export default class Phases extends Component {
  render() {
    const { onPhaseChanged, phases, currentPath } = this.props;

    const checkStatus = (element) => {
      if (element.path === currentPath) {
        this.props.phases.currentTitle = element.title;
        return true;
      }
      return false;
    };

    const phaseTabs = phases.map((element, idx) => {
      idx += 1;
      const { title } = element;
      
      return (
        <div className={`stepper-tab-group ${(checkStatus(element) ? 'active' : '')}`} key={idx} >
          <div className="gapped">
            <div className="phase">
              <div className="phase-label" onClick={() => onPhaseChanged(element)}>{idx}</div>
            </div>
          </div>
          <div className="stepper-tab-label">{title}</div>
        </div>
      );
    });
    return (
      phaseTabs
    );
  };
}
