import React, { Component, Fragment } from 'react';
import Router from 'next/router';
import { observer, inject } from 'mobx-react';
import {
  PopupboxManager,
  PopupboxContainer,
} from 'react-popupbox';

import PhaseView from '../common/Phaser/PhaseView';
import Templates from './templates/Templates';
import VideoSelectionWorkspace from './editor/workspaces/VideoSelectionWorkspace';
import NicheScriptsWorkspace from './niche-scripts/NicheScriptsWorkspace';
import Project from '../../lib/editor/Project';
import VideoUpload from '../common/VideoUpload';

@inject('api')
@inject('store')
@observer
export default class GettingStarted extends Component {
  static WIZARD_TYPES = {
    FROM_TEMPLATE: { key: 'template', label: 'Choose Template' },
    GENERATOR: { key: 'generator', label: 'Choose a Video' },
    VIDEO_UPLOAD: { key: 'upload', label: 'Upload Your Video' },
  };

  constructor(props) {
    super(props);
    const { store: { wizard } } = this.props;
    const foundWizardType = Object
      .entries(this.constructor.WIZARD_TYPES)
      .find(([key, item]) => item.key === wizard);
    this.state = {
      wizardType: foundWizardType && foundWizardType[1],
    };
  }

  state = {
    wizardType: null,
  };

  getWizard(wizardType) {
    const {
      store: {
        common: {
          features,
        },
        currentUser,
      },
    } = this.props;
    switch (wizardType) {
      case GettingStarted.WIZARD_TYPES.GENERATOR:
        return (
          <div className="full-height">
            <PopupboxContainer
              ref={(c) => { this.popupboxContainer = c; }}
              onClosed={() => {
                this.popupboxContainer.state.children = null;
              }}
            />
            <VideoSelectionWorkspace
              className="wizard-gallery"
              onVideoSelected={(video) => {
                const nicheSelection = (<NicheScriptsWorkspace
                  className="niche-scripts"
                  onScriptSelected={(script) => {
                    this.handleWizardSelection({ script, video });
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
        return (
          <div className="scrollable full-height video-upload">
            <PopupboxContainer
              ref={(c) => { this.popupboxContainer = c; }}
              onClosed={() => {
                this.popupboxContainer.state.children = null;
              }}
            />
            <VideoUpload onVideoUploaded={(video) => {
              this.handleWizardSelection({ video });
            }}
            />
          </div>);
      case GettingStarted.WIZARD_TYPES.FROM_TEMPLATE:
        return <Templates onTemplateSelected={data => this.handleWizardSelection(data)} />;
      default:
        return (
          <div className="scrollable full-height getting-started">
            <div className="getting-started-list">
              <div className="getting-started-item">
                <div
                  className="getting-started-item-inner"
                  onClick={() => {
                    Router.push({ pathname: '/', query: { wizard: this.constructor.WIZARD_TYPES.FROM_TEMPLATE.key } });
                    this.setState({ wizardType: this.constructor.WIZARD_TYPES.FROM_TEMPLATE });
                  }}
                >
                  <img
                    src="../../static/images/getting-started/template.svg"
                    alt="From Template"
                  />
                  <span>From Template</span>
                </div>
              </div>
              <div
                title={(currentUser.features[features.generator] && currentUser.features[features.generator].state === 'enabled') ? '' : 'This feature is not available on your type of subscription. Click here to details.'}
                className={`getting-started-item ${(currentUser.features[features.generator] && currentUser.features[features.generator].state === 'enabled') ? '' : 'inactive'}`}
              >
                <div
                  className="getting-started-item-inner"
                  onClick={() => {
                    if (currentUser.features[features.generator] && currentUser.features[features.generator].state === 'enabled') {
                      Router.push({ pathname: '/', query: { wizard: this.constructor.WIZARD_TYPES.GENERATOR.key } });
                      this.setState({ wizardType: this.constructor.WIZARD_TYPES.GENERATOR });
                    } else {
                      // TODO: implement transition to upgrade
                    }
                  }}
                >
                  <img
                    src="../../static/images/getting-started/generator.svg"
                    alt="Template Generator"
                  />
                  <span>Template Generator</span>
                </div>
              </div>
              <div className="getting-started-item">
                <div
                  className="getting-started-item-inner"
                  onClick={() => {
                    Router.push({ pathname: '/', query: { wizard: this.constructor.WIZARD_TYPES.VIDEO_UPLOAD.key } });
                    this.setState({ wizardType: this.constructor.WIZARD_TYPES.VIDEO_UPLOAD });
                  }}
                >
                  <img
                    src="../../static/images/getting-started/upload.svg"
                    alt="Import Your Own Video"
                  />
                  <span>Import Your Own Video</span>
                </div>
              </div>
            </div>
          </div>);
    }
  }

  async handleWizardSelection(data) {
    const { wizardType } = this.state;
    const { api, store } = this.props;
    switch (wizardType) {
      case GettingStarted.WIZARD_TYPES.FROM_TEMPLATE:
        store.activeProject = Project.fromTemplate(data, true);
        store.activeProject.usedWizard = wizardType;
        Router.push({ pathname: '/edit' });
        break;
      case GettingStarted.WIZARD_TYPES.GENERATOR:
        store.activeProject = Project.fromTemplate(data.script, true);
        await store.activeProject.updateVideo(data.video);
        store.activeProject.usedWizard = wizardType;
        Router.push({ pathname: '/edit' });
        break;
      case GettingStarted.WIZARD_TYPES.VIDEO_UPLOAD:
        store.activeProject = Project.fromTemplate((await api.defaults())[0], true);
        await store.activeProject.updateVideo(data.video);
        store.activeProject.usedWizard = wizardType;
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
        {wizardType ? <PhaseView
          elements={[
            {
              key: 'getting-started',
              title: wizardType.label,
              active: true,
              available: true,
            },
            {
              key: 'edit',
              title: 'Customize Video',
              active: false,
              available: false,
            },
            {
              key: 'publish',
              title: 'Publish & Share',
              active: false,
              available: false,
            },
          ]}
          onPhaseChanged={() => {}}
        /> : null }
        {this.getWizard(wizardType)}
      </Fragment>
    );
  }
}
