import React, { Component } from 'react';

import Phases from './Phases';

export default class PhaseView extends Component {
  state = {
    title: '',
  };

  componentDidMount() {
    this.updateTitle();
  }

  updateTitle() {
    let tempTitle;
    const { url } = this.props;
    const { phaserElements } = this.props;
    phaserElements.forEach((element) => {
      if (element.path === url.pathname) {
        tempTitle = element.title;
      }
    });
    this.setState({ title: tempTitle });
  }

  render() {
    const { url } = this.props;
    let { phaserElements } = this.props;
    let currentTitle = this.state.title;

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
      this.setState({
        title: tempTitle,
      });
      phaserElements = [...updateElements];
    };

    const checkStatus = (element) => {
      if (element.path === url.pathname) {
        return true;
      } else {
        element.selected = false;
      }
      return false;
    };

    return (
      <div className="phase-component">
        <div className="phase-state-title">
          <div>{currentTitle}</div>
        </div>
        <div className="phase-state-tabs">
          <div className="stepper">
            <div className="line"></div>
            <Phases
              phases={phaserElements}
              onPhaseChanged={event => phaseHasChanged(event)} 
              statusCheck={checkStatus}
            />
          </div>
        </div>
      </div>
    );
  }
}
