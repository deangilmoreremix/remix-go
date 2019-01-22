import React, { Component, Fragment } from 'react';
import { Container, Col, Row, Input } from 'reactstrap';
import { inject, observer } from 'mobx-react';
import Router from 'next/router';
import {
  PopupboxManager,
  PopupboxContainer,
} from 'react-popupbox';
import Head from 'next/head';

import Waiter from '../common/Waiter';
import GettingStarted from './GettingStarted';
import PhaseView from '../common/Phaser/PhaseView';
import Project from '../../lib/editor/Project';
import ActionsPane from './editor/ActionsPane';
import InfiniteLoading from '../common/InfiniteLoading';
import EmbeddedPlayback from '../common/EmbeddedPlayback';
import EmbedDataContainer from './publisher/EmbedDataContainer';
import ProjectDetailsChanger from './publisher/ProjectDetailsChanger';
import EmailCampaign from './publisher/campaigns/EmailCampaign';
import SocialCampaign from './publisher/campaigns/SocialCampaign';
import RetargetCampaign from './publisher/campaigns/RetargetCampaign';

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

  state = {
    waiter: null,
  };

  onProjectUpdate = async (project) => {
    this.setState({ waiter: { message: 'Updating your project details...' } });
    const { api, store } = this.props;
    const { activeProject } = store;
    await api.save(project);
    await api.publish(project);
    activeProject.version = Math.random();
    store.activeProject = project;
    this.setState({ waiter: null });
  };

  retrieveProject = async (projectId) => {
    const { api, store } = this.props;
    store.activeProject = new Project(await api.get(projectId));
  };

  render() {
    const {
      store: {
        activeProject,
        whiteLabelManager,
        common: {
          features,
        },
        currentUser,
        project,
      },
    } = this.props;
    const { waiter } = this.state;
    return (
      <Fragment>
        <Head>
          <title>
            {activeProject && activeProject.make && activeProject.make._id ?
              `${activeProject.name} - ${whiteLabelManager.brandName}` :
              whiteLabelManager.brandName}
          </title>
        </Head>
        { activeProject ? <PhaseView
          elements={[
            {
              key: 'getting-started',
              title: ((activeProject && activeProject.usedWizard) ||
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
        <iframe
          title="Iframe social conductor"
          src="//dev-cdn.vidcloud.io/social-campaign/social-campaign.html"
          frameBorder="0"
          className="conductor-iframe"
          id="conductor-iframe"
          ref={(c) => { this.iframeConductor = c; }}
        />
        <PopupboxContainer
          ref={(c) => { this.popupboxContainer = c; }}
          onClosed={() => {
            this.popupboxContainer.state.children = null;
          }}
        />
        { waiter ? <Waiter message={waiter.message} /> : null }
        <Container fluid className={`publisher-wrapper project-expector ${activeProject && 'hidden'}`}>
          {project ? <InfiniteLoading /> : <div>There is no active project.</div>}
        </Container>
        {activeProject ?
          <Container fluid className={`publisher-wrapper ${!activeProject && 'hidden'}`}>
            <Row className="canvas full-height">
              <Col className="workspace scrollable">
                <div className="publish-overview">
                  <Container fluid className="publish-overview-inner">
                    <Col className="overview-column">
                      <h5 className="overview-item">Your project details</h5>
                      <ProjectDetailsChanger
                        className="overview-item overview-edit"
                        project={activeProject || {}}
                        onChange={updatedProject => this.onProjectUpdate(updatedProject)}
                      />
                    </Col>
                    <Col className="overview-column">
                      <h5 className="overview-item">Preview & Embed</h5>
                      <EmbeddedPlayback
                        className="overview-item"
                        key={activeProject && activeProject.version}
                        source={activeProject && activeProject.make.url}
                        title={activeProject && activeProject.make.title}
                        width="50%"
                        height="40%"
                      />
                      <label className="overview-item">URL</label>
                      <Input className="overview-item embed-url" type="text" value={activeProject && activeProject.make.url} readOnly />
                      <label className="overview-item">Embed</label>
                      <EmbedDataContainer className="overview-item embed-item" url={activeProject && activeProject.make.url} />
                    </Col>
                  </Container>
                </div>
              </Col>
              <Col className="col-2 paddingless publisher-pane">
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
                          iframeConductor={this.iframeConductor}
                          onCampaignFinished={() => {
                            PopupboxManager.close();
                            alert('This video has been posted with Social Campaign successfully.');
                          }}
                          onTitleUpdated={title => PopupboxManager.update({
                            config: {
                              titleBar: {
                                text: title,
                              },
                            },
                          })}
                        />,
                        config: {
                          titleBar: {
                            enable: true,
                            text: 'Social Campaign',
                          },
                          fadeIn: true,
                          fadeInSpeed: 200,
                        },
                      });
                    }}
                  >
                    Social Campaign
                  </button>
                  <button
                    className={`go-button action-button ${(currentUser.features[features.retarget] && currentUser.features[features.retarget].state === 'enabled') ? '' : 'inactive'}`}
                    title={(currentUser.features[features.retarget] && currentUser.features[features.retarget].state === 'enabled') ? '' : 'This feature is not available on your type of subscription. Click here to details.'}
                    onClick={() => {
                      if (currentUser.features[features.retarget] && currentUser.features[features.retarget].state === 'enabled') {
                        PopupboxManager.open({
                          content: <RetargetCampaign
                            className="campaign"
                            project={activeProject}
                            onCampaignFinished={() => PopupboxManager.close()}
                          />,
                          config: {
                            titleBar: {
                              enable: true,
                              text: 'Opt-In/Retarget',
                            },
                            fadeIn: true,
                            fadeInSpeed: 200,
                          },
                        });
                      } else if (currentUser.features[features.retarget].link) {
                        window.open(currentUser.features[features.retarget].link, '_blank');
                      }
                    }}
                  >
                    Opt-In/Retarget
                  </button>
                </ActionsPane>
              </Col>
            </Row>
          </Container> : null}
      </Fragment>
    );
  }
}
