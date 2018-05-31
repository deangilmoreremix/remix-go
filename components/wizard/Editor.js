import React, { Component, Fragment } from 'react';
import { Container, Col, Row } from 'reactstrap';
import { inject, observer } from 'mobx-react';
import Router from 'next/router';
import {
  PopupboxManager,
  PopupboxContainer,
} from 'react-popupbox';

import Waiter from '../common/Waiter';
import GettingStarted from './GettingStarted';
import Project from '../../lib/editor/Project';
import PhaseView from '../common/Phaser/PhaseView';
import WorkspaceContainer from './editor/WorkspaceContainer';
import EditorStageChanger from './editor/EditorStageChanger';
import ActionsPane from './editor/ActionsPane';
import InfiniteLoading from '../common/InfiniteLoading';
import Personalizer from './editor/workspaces/construction/Personalizer';
import PopcornEditor from '../../lib/popcorn/plugins/editor.popcorn';
import CallToActions from './editor/call-to-actions/CallToActions';
import NicheScriptsWorkspace from './niche-scripts/NicheScriptsWorkspace';
import EmbeddedPlayback from '../common/EmbeddedPlayback';

const insertAtCaret = (element, offset, text) => {
  const front = (element.innerText).substring(0, offset);
  const back = (element.innerText).substring(offset, element.innerText.length);
  element.innerText = front + text + back;
};

@inject('api')
@inject('store')
@observer
export default class Editor extends Component {
  constructor(props) {
    super(props);

    const { store: { activeProject, project } } = this.props;
    if (!activeProject && project) {
      this.retrieveProject(project);
    }
  }

  state = {
    waiter: null,
    key: Math.random(),
  };

  retrieveProject = async (projectId) => {
    const { api, store } = this.props;
    store.activeProject = new Project(await api.get(projectId));
  };

  render() {
    const {
      api,
      store,
      store: {
        activeProject,
        project,
        common: {
          features,
        },
        currentUser,
        editorStateManager,
      },
    } = this.props;
    const { waiter, key } = this.state;
    /* eslint-disable no-underscore-dangle */
    const ToolbarEditor = activeProject && activeProject.activeElement &&
      PopcornEditor.editors[activeProject.activeElement._natives.type];

    if (process.browser) {
      window.onbeforeunload = () => {
        const { modified } = activeProject;
        if (modified) {
          return confirm('There are unsaved changes, do you want to continue?');
        } else {
          return null;
        }
      };
    }

    return (
      <Fragment>
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
              active: true,
              available: true,
            },
            {
              key: 'publish',
              title: 'Publish & Share',
              active: false,
              available: activeProject && activeProject.make && activeProject.make._id,
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
              case 'publish':
                Router.push({
                  pathname: '/publish',
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
        { waiter ? <Waiter message={waiter.message} /> : null }
        <Container fluid className={`editor-wrapper project-expector ${activeProject && 'hidden'}`}>
          {project ? <InfiniteLoading /> : <div>There is no active project.</div>}
        </Container>
        <Container fluid className={`editor-wrapper ${!activeProject && 'hidden'}`}>
          <Row className={`toolbar ${(!activeProject || !activeProject.activeElement) && 'hidden'}`}>
            {activeProject && activeProject.activeElement ? <ToolbarEditor
              element={activeProject && activeProject.activeElement}
              onElementUpdate={(updatedProps) => {
                /* eslint-disable no-underscore-dangle */
                activeProject.activeElement._natives._update
                  .call(this, activeProject.activeElement, updatedProps);
                activeProject.update(activeProject.activeElement, updatedProps);
              }}
            /> : null}
          </Row>
          <Row className="canvas full-height">
            <Col className="col-2 paddingless editor-pane">
              <EditorStageChanger
                className="stage-wrapper"
                stage={editorStateManager.stage}
                onChange={(stage) => {
                  editorStateManager.stage = stage;
                  editorStateManager.toolbar = null;
                }}
              />
            </Col>
            <Col className="workspace" key={key}>
              <WorkspaceContainer stateManager={editorStateManager} className="full-height" />
            </Col>
            <Col className="col-2 paddingless editor-pane">
              <ActionsPane className="actions-pane scrollable">
                <button
                  className="go-button action-button"
                  onClick={() => {
                    PopupboxManager.open({
                      content: <EmbeddedPlayback
                        source={activeProject}
                        title="Preview"
                        width="840"
                        height="480"
                      />,
                      config: {
                        titleBar: {
                          enable: true,
                          text: 'Preview',
                        },
                        fadeIn: true,
                        fadeInSpeed: 200,
                      },
                    });
                  }}
                >
                  Preview
                </button>
                <button
                  className="go-button action-button"
                  onClick={async () => {
                    this.setState({ waiter: { message: 'Saving your project...' } });
                    const savedProject = await api.publish(await api.save(activeProject));
                    Router.push({
                      pathname: '/publish',
                      query: { project: savedProject.make._id },
                    });
                    this.setState({ waiter: null });
                  }}
                >Publish & Share
                </button>
                <button
                  title={(!activeProject || !activeProject.activeElement) ? 'To use personalizer, please select any video element first.' : ''}
                  className={`addon-button ${(!activeProject || !activeProject.activeElement) && 'inactive'}`}
                  onClick={() => {
                    if (activeProject && activeProject.activeElement) {
                      PopupboxManager.open({
                        content: <Personalizer
                          className="personalizer"
                          onTokenChosen={(token) => {
                            const {
                              _activeHandle: { type, target },
                              caretOffsets: offset,
                            } = activeProject.activeElement;
                            insertAtCaret(target, offset[type], token);

                            const event = new Event('input');
                            target.dispatchEvent(event);

                            const updatedProps = {};
                            updatedProps[type] = target.innerText;
                            activeProject.activeElement._natives._update
                              .call(this, activeProject.activeElement, updatedProps);
                            activeProject.update(activeProject.activeElement, updatedProps);
                            PopupboxManager.close();
                          }}
                        />,
                        config: {
                          titleBar: {
                            enable: true,
                            text: 'Personalizer',
                          },
                          fadeIn: true,
                          fadeInSpeed: 200,
                        },
                      });
                    }
                  }}
                >
                  <img className="icon" src="../../static/images/editor/personalizer.svg" alt="" />
                  <span>Personalizer</span>
                </button>
                <button
                  className={`addon-button ${(currentUser.features[features.cta] && currentUser.features[features.cta].state === 'enabled') ? '' : 'inactive'}`}
                  title={(currentUser.features[features.cta] && currentUser.features[features.cta].state === 'enabled') ? '' : 'This feature is not available on your type of subscription. Click here to details.'}
                  onClick={() => {
                    if (currentUser.features[features.cta] && currentUser.features[features.cta].state === 'enabled') {
                      PopupboxManager.open({
                        content: <CallToActions
                          className="cta-library"
                          onCtaSelected={(cta) => {
                            activeProject.cta = new Project(cta);
                            PopupboxManager.close();
                          }}
                        />,
                        config: {
                          titleBar: {
                            enable: true,
                            text: 'CTA Library',
                          },
                          fadeIn: true,
                          fadeInSpeed: 200,
                        },
                      });
                    } else {
                      // TODO: forward to upgrade link
                    }
                  }}
                >
                  <img className="icon" src="../../static/images/editor/cta.svg" alt="" />
                  <span>Call to Action</span>
                </button>
                <button
                  className={`addon-button ${(currentUser.features[features.generator] && currentUser.features[features.generator].state === 'enabled') ? '' : 'inactive'}`}
                  title={(currentUser.features[features.generator] && currentUser.features[features.generator].state === 'enabled') ? '' : 'This feature is not available on your type of subscription. Click here to details.'}
                  onClick={() => {
                    if (currentUser.features[features.generator] && currentUser.features[features.generator].state === 'enabled') {
                      PopupboxManager.open({
                        content: <NicheScriptsWorkspace
                          className="niche-scripts"
                          onScriptSelected={async (script) => {
                            const regeneratedProject = Project.fromTemplate(script, true);
                            await regeneratedProject.updateVideo(activeProject.video);
                            regeneratedProject.usedWizard = activeProject.wizardType;
                            store.activeProject = regeneratedProject;
                            // this is to force re-render workspace
                            // and show popcorn updates immediately
                            this.setState({ key: Math.random() });
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
                    } else {
                      // TODO: forward to upgrade link
                    }
                  }}
                >
                  <img className="icon" src="../../static/images/editor/niche_scripts.svg" alt="" />
                  <span>Niche Scripts</span>
                </button>
              </ActionsPane>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}
