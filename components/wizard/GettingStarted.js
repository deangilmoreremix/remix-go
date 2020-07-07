import React, { Component, Fragment } from 'react';
import Router from 'next/router';
import { observer, inject } from 'mobx-react';
import SVGInline from 'react-svg-inline';
import {
  PopupboxManager,
  PopupboxContainer,
} from 'react-popupbox';

import Waiter from '../common/Waiter';
import PhaseView from '../common/Phaser/PhaseView';
import Templates from './templates/Templates';
import VideoSelectionWorkspace from './editor/workspaces/VideoSelectionWorkspace';
import NicheScriptsWorkspace from './niche-scripts/NicheScriptsWorkspace';
import Project from '../../lib/editor/Project';
import VideoUpload from '../common/VideoUpload';

import SVGFromTemplate from '../../static/images/getting-started/template.svg';
import SVGTemplateGenerator from '../../static/images/getting-started/generator.svg';
import SVGVideoUpload from '../../static/images/getting-started/upload.svg';
import SVGMyProjects from '../../static/images/getting-started/my_projects.svg';

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
    const wizard = this.props.store.wizard || (process.browser && Router.query.wizard);
    const foundWizardType = Object
      .entries(this.constructor.WIZARD_TYPES)
      .find(([key, item]) => item.key === wizard);
    this.state = {
      wizardType: foundWizardType && foundWizardType[1],
    };
  }

  getWizard(wizardType) {
    const { store: { whiteLabelManager, common: { features, prefixes }, currentUser } } = this.props;
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
            <VideoUpload onVideoUploaded={(video, trim) => {
              this.handleWizardSelection({ video, trim });
            }}
            />
          </div>);
      case GettingStarted.WIZARD_TYPES.FROM_TEMPLATE:
        return <Templates onTemplateSelected={data => this.handleWizardSelection(data)} />;
      default:
        return (
          <div className="scrollable full-height getting-started">
            <div className="welcome">
              <h2>Welcome to {whiteLabelManager.appName}!</h2>
              {whiteLabelManager.tutorialsLink &&
              <a
                href={'http://support.videoremix.io/en/collections/2432930-go-easy-editor'}
                target="_blank"
                rel="noopener noreferer"
                className="click-here"
              >
                Click here to view the tutorials.
              </a>
              }
            </div>
            <div className="getting-started-list">
              <a
                className="getting-started-item"
                href={`/?wizard=${this.constructor.WIZARD_TYPES.FROM_TEMPLATE.key}`}
              >
                <div className="getting-started-item-inner">
                  <SVGInline className="from-template-icon" classSuffix="" svg={SVGFromTemplate} cleanup={['title']} />
                  <span>Start From Template</span>
                </div>
              </a>
              <a
                title={(currentUser && currentUser.features[features.generator] && currentUser.features[features.generator].state === 'enabled') ? '' : 'This feature is not available on your type of subscription. Click here to details.'}
                className={`getting-started-item ${(currentUser && currentUser.features[features.generator] && currentUser.features[features.generator].state === 'enabled') ? '' : 'inactive'}`}
                href={(currentUser && currentUser.features[features.generator] && currentUser.features[features.generator].state === 'enabled') ?
                  `/?wizard=${this.constructor.WIZARD_TYPES.GENERATOR.key}` :
                  currentUser && currentUser.features[features.generator] && currentUser.features[features.generator].link
                }
                target={(currentUser && currentUser.features[features.generator] && currentUser.features[features.generator].state === 'enabled') ?
                  '_self' :
                  '_blank'
                }
              >
                <div className="getting-started-item-inner">
                  <SVGInline className="template-generator-icon" classSuffix="" svg={SVGTemplateGenerator} cleanup={['title']} />
                  <span>Template Generator</span>
                </div>
              </a>
              <a
                className="getting-started-item"
                href={`/?wizard=${this.constructor.WIZARD_TYPES.VIDEO_UPLOAD.key}`}
              >
                <div className="getting-started-item-inner">
                  <SVGInline className="video-upload-icon" classSuffix="" svg={SVGVideoUpload} cleanup={['title']} />
                  <span>Import Your Own Video</span>
                </div>
              </a>
              <a
                className="getting-started-item"
                href={`//${prefixes.projects}.${whiteLabelManager.domain}/me`}
              >
                <div className="getting-started-item-inner">
                  <SVGInline className="my-project-icon" classSuffix="" svg={SVGMyProjects} cleanup={['title']} />
                  <span>My Projects</span>
                </div>
              </a>
            </div>
          </div>);
    }
  }

  async handleWizardSelection(data) {
    const { wizardType } = this.state;
    const { api, store, store: { common: { features }, currentUser } } = this.props;
    this.setState({ waiter: { message: 'Preparing your project...' } });
    switch (wizardType) {
      case GettingStarted.WIZARD_TYPES.FROM_TEMPLATE:
        store.activeProject = Project.fromTemplate(data, true);
        break;
      case GettingStarted.WIZARD_TYPES.GENERATOR:
        store.activeProject = Project.fromTemplate(data.script, true);
        await store.activeProject.updateVideo(data.video);
        store.activeProject.thumbnail = store.common.defaultPosterframe;
        break;
      case GettingStarted.WIZARD_TYPES.VIDEO_UPLOAD:
        store.activeProject = Project.fromTemplate((await api.defaults())[0], true);
        await store.activeProject.updateVideo(data.video, data.trim);
        store.activeProject.thumbnail = store.common.defaultPosterframe;
        if (currentUser.features[features.generator] && currentUser.features[features.generator].state === 'enabled') {
          PopupboxManager.open({
            content: <NicheScriptsWorkspace
              className="niche-scripts"
              useWaiter
              onScriptSelected={async (script) => {
                const regeneratedProject = Project.fromTemplate(script, true);
                await regeneratedProject.updateVideo(store.activeProject.video);
                regeneratedProject.usedWizard = store.activeProject.wizardType;
                regeneratedProject.thumbnail = store.common.defaultPosterframe;
                store.activeProject = regeneratedProject;
                store.activeProject.version = Math.random();
                PopupboxManager.close();
              }}
            />,
            config: {
              titleBar: {
                enable: true,
                text: 'Select a niche script',
              },
              fadeIn: true,
              fadeInSpeed: 200,
            },
          });
        } else if (currentUser.features[features.generator].link) {
          window.open(currentUser.features[features.generator].link, '_blank');
        }
        break;
      default:
        break;
    }
    store.activeProject.usedWizard = wizardType;
    Router.push({ pathname: '/edit' });
    this.setState({ waiter: { message: null } });
  }

  render() {
    const { wizardType, waiter } = this.state;
    return (
      <Fragment>
        { waiter ? <Waiter message={waiter.message} /> : null }
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
