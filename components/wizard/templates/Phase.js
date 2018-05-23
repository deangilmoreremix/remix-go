import React, { Component } from 'react';

export default class Phase extends Component {
  constructor() {
    super();

    this.state = {
      title: `Choose Template`,
      tabName: `chooseTemplate`,
    };

    this.phaseTabs = {
      chooseTemplate: {
        phaseTitle: 'Choose Template',
        phaseTabName: `chooseTemplate`,
        phaseTabValue: 1,
        selected: true,
      },
      customizeVideo: {
        phaseTitle: 'Customize Video',
        phaseTabName: `customizeVideo`,
        phaseTabValue: 2,
        selected: false,
      },
      publishVideo: {
        phaseTitle: 'Publish & Video',
        phaseTabName: `publishVideo`,
        phaseTabValue: 3,
        selected: false,
      },
    };

    this.TABS = {
      CHOOSE_TEMPLATE: 1,
      CUSTOMIZE_VIDEO: 2,
      PUBLISH_VIDEO: 3,
    };
  }

  render() {
    const { title } = this.state;

    const PhaseTab = (props) => {
      const { handleClick } = props;
      const { phaseTitle, phaseTabName, phaseTabValue, selected } = props.value;
      return (
        <div className={`stepper-tab-group ${(selected?'active':'')}`} >
          <div className="gapped">
            <div className="phase">
              <div className="phase-label" onClick={() => onSelectPhase(phaseTabName)}>{phaseTabValue}</div>
            </div>
          </div>
          <div className="stepper-tab-label">{phaseTitle}</div>
        </div>
      );
    };

    const deselectPhase = () => {
      const { tabName } = this.state;
      this.phaseTabs[tabName].selected = false;
    };

    const selectPhase = (tabName) => {
      this.phaseTabs[tabName].selected = true;
    };

    const onSelectPhase = (tabName) => {
      deselectPhase();
      selectPhase(tabName);

      const tabSelected = this.phaseTabs[tabName];
      const { phaseTitle, phaseTabName } = tabSelected;
      this.setState({
        title: phaseTitle,
        tabName: phaseTabName,
      });
    };

    return (
      <div className="phase-component">
        <div className="phase-state-title">
          <div>{title}</div>
        </div>
        <div className="phase-state-tabs">
          <div className="stepper">
            <div className="line"></div>
            <PhaseTab handleClick={onSelectPhase} value={this.phaseTabs.chooseTemplate} />
            <PhaseTab handleClick={onSelectPhase} value={this.phaseTabs.customizeVideo} />
            <PhaseTab handleClick={onSelectPhase} value={this.phaseTabs.publishVideo} />
          </div>
        </div>
      </div>
    );
  }
}
