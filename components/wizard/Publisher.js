import React, { Component, Fragment } from 'react';
import { Container, Col, Row, Input } from 'reactstrap';
import { inject, observer } from 'mobx-react';
import Router from 'next/router';
import {
  PopupboxManager,
  PopupboxContainer,
} from 'react-popupbox';

import GettingStarted from './GettingStarted';
import PhaseView from '../common/Phaser/PhaseView';
import Project from '../../lib/editor/Project';
import ActionsPane from './editor/ActionsPane';
import InfiniteLoading from '../common/InfiniteLoading';
import EmbeddedPlayback from '../common/EmbeddedPlayback';
import EmbedDataContainer from './publisher/EmbedDataContainer';
import ProjectNameChanger from './publisher/ProjectNameChanger';
import EmailCampaign from './publisher/campaigns/EmailCampaign';
import SocialCampaign from './publisher/campaigns/SocialCampaign';

@inject('api')
@inject('store')
@observer
export default class Publisher extends Component {
  constructor(props) {
    super(props);

    const { store: { activeProject, project } } = this.props;
    if (!activeProject && project) {
      this.retrieveProject(project);
    }
  }

  onTitleUpdate = async (title) => {
    const { api, store: { activeProject } } = this.props;
    activeProject.name = title;
    await api.save(activeProject);
  };

  retrieveProject = async (projectId) => {
    const { api, store } = this.props;
    store.activeProject = new Project(await api.get(projectId));
  };

  render() {
    const {
      store: {
        activeProject,
        project,
      },
    } = this.props;
    return (
      <Fragment>
        <iframe
          title="Facebook conductor"
          src="http://dev-cdn.vidcloud.io/social-campaign/social-campaign.html"
          frameBorder="0"
          className="conductor-iframe"
          id="conductor-iframe"
          ref={(c) => { this.facebookConductor = c; }}
          onLoad={() => {
            this.facebookConductor.contentWindow.postMessage({
              topic: 'Initial load',
              config: {},
              topics: SocialCampaign.FACEBOOK_MESSAGE_TOPICS,
              parentWindowUrl: window.location.origin + window.location.pathname,
            }, this.facebookConductor.src);
          }}
        />
        <PopupboxContainer
          ref={(c) => { this.popupboxContainer = c; }}
          onClosed={() => {
            this.popupboxContainer.state.children = null;
          }}
        />
        { activeProject ? <PhaseView
          elements={[
            {
              key: 'getting-started',
              title: ((project && project.usedWizard) ||
                GettingStarted.WIZARD_TYPES.FROM_TEMPLATE).label,
              active: false,
              available: true,
            },
            {
              key: 'edit',
              title: 'Customize Video',
              active: false,
              available: true,
            },
            {
              key: 'publish',
              title: 'Publish & Share',
              active: true,
              available: true,
            },
          ]}
          onPhaseChanged={(element) => {
            switch (element.key) {
              case 'getting-started':
                Router.push({
                  pathname: '/',
                  query: {
                    wizard: ((activeProject && activeProject.usedWizard) ||
                      GettingStarted.WIZARD_TYPES.FROM_TEMPLATE).key,
                  },
                });
                break;
              case 'edit':
                Router.push({
                  pathname: '/edit',
                  query: {
                    project: activeProject.make._id,
                  },
                });
                break;
              default:
                break;
            }
          }}
        /> : null }
        <Container fluid className={`editor-wrapper project-expector ${activeProject && 'hidden'}`}>
          {project ? <InfiniteLoading /> : <div>There is no active project.</div>}
        </Container>
        <Container fluid className={`editor-wrapper ${!activeProject && 'hidden'}`}>
          <Row className="canvas full-height">
            <Col className="workspace">
              <div className="publish-overview">
                <ProjectNameChanger
                  className="overview-item title-edit"
                  title={activeProject && activeProject.make.title}
                  onChange={title => this.onTitleUpdate(title)}
                />
                <EmbeddedPlayback
                  className="overview-item"
                  source={activeProject && activeProject.make.url}
                  title={activeProject && activeProject.make.title}
                  width="50%"
                  height="50%"
                />
                <label className="overview-item">URL</label>
                <Input className="overview-item embed-url" type="text" value={activeProject && activeProject.make.url} readOnly />
                <label className="overview-item">Embed</label>
                <EmbedDataContainer className="overview-item embed-item" url={activeProject && activeProject.make.url} />
              </div>
            </Col>
            <Col className="col-2 paddingless editor-pane">
              <ActionsPane className="actions-pane">
                <button
                  className="go-button action-button"
                  onClick={() => {
                    PopupboxManager.open({
                      content: <EmailCampaign
                        className="campaign"
                        project={activeProject}
                        onCampaignFinished={() => PopupboxManager.close()}
                      />,
                      config: {
                        titleBar: {
                          enable: true,
                          text: 'Email Campaign',
                        },
                        fadeIn: true,
                        fadeInSpeed: 200,
                      },
                    });
                  }}
                >
                  Email Campaign
                </button>
                <button
                  className="go-button action-button"
                  onClick={() => {
                    PopupboxManager.open({
                      content: <SocialCampaign
                        className="campaign"
                        project={activeProject}
                        facebookConductor={this.facebookConductor}
                        onCampaignFinished={() => PopupboxManager.close()}
                      />,
                      config: {
                        titleBar: {
                          enable: true,
                          text: 'Facebook',
                        },
                        fadeIn: true,
                        fadeInSpeed: 200,
                      },
                    });
                  }}
                >
                  Facebook
                </button>
              </ActionsPane>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}
