import React, { Component, Fragment } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { observer, inject } from 'mobx-react';
import {
  PopupboxManager,
  PopupboxContainer,
} from 'react-popupbox';

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
    FROM_TEMPLATE: 'template',
    GENERATOR: 'generator',
    VIDEO_UPLOAD: 'upload',
  };

  constructor(props) {
    super(props);
    const { store: { wizard: wizardType } } = this.props;
    this.state = { wizardType };
  }

  state = {
    wizardType: null,
  };

  getWizard(wizardType) {
    switch (wizardType) {
      case GettingStarted.WIZARD_TYPES.GENERATOR:
        return (
          <div className="scrollable full-height">
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
            <VideoUpload onVideoUploaded={(videoUrl) => {
              const nicheSelection = (<NicheScriptsWorkspace
                className="niche-scripts"
                onScriptSelected={(script) => {
                  this.handleWizardSelection({ script, video: videoUrl });
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
                    Router.push({ pathname: '/', query: { wizard: this.constructor.WIZARD_TYPES.FROM_TEMPLATE } });
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
              <div className="getting-started-item">
                <div
                  className="getting-started-item-inner"
                  onClick={() => {
                    Router.push({ pathname: '/', query: { wizard: this.constructor.WIZARD_TYPES.GENERATOR } });
                    this.setState({ wizardType: this.constructor.WIZARD_TYPES.GENERATOR });
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
                    Router.push({ pathname: '/', query: { wizard: 'upload' } });
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
    const { store } = this.props;
    switch (wizardType) {
      case GettingStarted.WIZARD_TYPES.FROM_TEMPLATE:
        store.activeProject = new Project(data, true);
        Router.push({ pathname: '/edit' });
        break;
      case GettingStarted.WIZARD_TYPES.GENERATOR:
      case GettingStarted.WIZARD_TYPES.VIDEO_UPLOAD:
        store.activeProject = new Project(data.script, true);
        await store.activeProject.updateVideo(data.video);
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
