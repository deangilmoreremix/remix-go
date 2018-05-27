import React, { Component } from 'react';

import Phases from './Phases';

export default class PhaseView extends Component {
  state = {
    title: 'Choose Template',
  };

  render() {
    let { phaserElements } = this.props;
    const currentTitle = this.state.title;

    const phaseHasChanged = (selectedTab) => {
      let tempTitle;

      const updateElements = phaserElements.map((element) => {
        const { selected, title } = element;
        if (selected && title !== selectedTab.title) element.selected = false;
        if (title === selectedTab.title) {
          element.selected = true;
          tempTitle = element.title;
        }
        return element;
      });
      this.setState({ title: tempTitle });
      phaserElements = [...updateElements];
    };

    return (
      <div className="phase-component">
        <div className="phase-state-title">
          <div>{currentTitle}</div>
        </div>
        <div className="phase-state-tabs">
          <div className="stepper">
            <div className="line"></div>
            <Phases phases={phaserElements} onPhaseChanged={event => phaseHasChanged(event)} />
          </div>
        </div>
      </div>
    );
  }
}
