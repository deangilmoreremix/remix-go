import React, { Component } from 'react';

export default class Phases extends Component {
  render() {
    const { onPhaseChanged, phases } = this.props;
    const phaseTabs = phases.map((element, idx) => {
      idx += 1;
      const { title, selected } = element;
      return (
        <div className={`stepper-tab-group ${(selected ? 'active' : '')}`} key={idx} >
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
