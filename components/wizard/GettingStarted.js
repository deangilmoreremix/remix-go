import React, { Component, Fragment } from 'react';
import Router from 'next/router';
import { observer, inject } from 'mobx-react';
import {
  PopupboxManager,
  PopupboxContainer,
} from 'react-popupbox';

import Templates from './templates/Templates';
import VideoSelectionWorkspace from './editor/workspaces/VideoSelectionWorkspace';
import NicheScriptsWorkspace from "./niche-scripts/NicheScriptsWorkspace";

@inject('api')
@inject('store')
@observer
export default class GettingStarted extends Component {
  static WIZARD_TYPES = {
    FROM_TEMPLATE: 'template',
    GENERATOR: 'generator',
    VIDEO_UPLOAD: 'upload',
  };

  state = {
    wizardType: null,
  };

  componentDidMount() {
    let wizardType = GettingStarted.WIZARD_TYPES.FROM_TEMPLATE;
    if (process.browser) {
      wizardType = Router.query.wizard;
    }
    this.setState({ wizardType });
  }

  getWizard(wizardType) {
    switch (wizardType) {
      case GettingStarted.WIZARD_TYPES.GENERATOR:
        return (
          <div className="scrollable full-height">
            <PopupboxContainer />
            <VideoSelectionWorkspace
              className="wizard-gallery"
              onVideoSelected={(video) => {
                const nicheSelection = (<NicheScriptsWorkspace className="niche-scripts" onScriptSelected={(script) => {
                  console.log(script);
                }}
                />);
                PopupboxManager.open({
                  content: nicheSelection,
                  config: {
                    titleBar: {
                      enable: true,
                      text: 'Select a niche script',
                    },
                    fadeIn: true,
                    fadeInSpeed: 200,
                  },
                });
              }}
            />
          </div>);
      case GettingStarted.WIZARD_TYPES.VIDEO_UPLOAD:
        return 'Video upload is coming soon';
      default:
        return <Templates onTemplateSelected={template => this.handleWizardSelection(template)} />;
    }
  }

  handleWizardSelection(data) {
    const { wizardType } = this.state;
    const { store } = this.props;
    switch (wizardType) {
      case GettingStarted.WIZARD_TYPES.FROM_TEMPLATE:
        store.activeProject = data;
        Router.push({ pathname: '/edit' });
        break;
      default:
        break;
    }
  }

  render() {
    const { wizardType } = this.state;
    return (
      <Fragment>
        {this.getWizard(wizardType)}
      </Fragment>
    );
  }
}
