import React, { Component, Fragment } from 'react';
import Head from 'next/head';
import { Container, Col, Row } from 'reactstrap';
import { inject, observer } from 'mobx-react';
import { observable, action } from 'mobx';
import SVGInline from 'react-svg-inline';
import Router from 'next/router';
import customizeVideoIcon from '../../static/images/Frame140.svg';
import publishShareIcon from '../../static/images/Frame138.svg';
import chooseTemplateIcon from '../../static/images/Frame139.svg';
import {
  PopupboxManager,
  PopupboxContainer,
} from 'react-popupbox';
import VideoPlayer from '../common/VideoPlayer';


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
// import EndScreens from './editor/endScreens/endScreen';
import NicheScriptsWorkspace from './niche-scripts/NicheScriptsWorkspace';
import EmbeddedPlayback from '../common/EmbeddedPlayback';
import NewElementBar from '../../lib/popcorn/plugins/new/editor.popcorn.new';
import StateManager from '../../lib/editor/editorStateManager';
import { formWarning } from '../../lib/validators/projectValidator';

import SVGCallToAction from '../../static/images/editor/cta.svg';
import SVGPersonalizer from '../../static/images/editor/personalizer.svg';
import SVGNicheScripts from '../../static/images/editor/nichescript.svg';
import SVGImageLTPreset from '../../static/images/editor/imageLTPreset.svg';


const insertAtCaret = (base, offset, text) => {
  const tokenRegex = /{{(up \w*|d \w* ("[^{}]*"|'[^{}]*')|"\w*"|\w*)}}/im;

  const reducedTokens = [];

  let reductionString = base;
  while (reductionString.indexOf('{{') !== -1) {
    reducedTokens.push(tokenRegex.exec(reductionString));
    reductionString = reductionString.replace(tokenRegex, (match) => {
      match = match.replace(/[{}]/gm, '');
      if (match.split(' ').length > 1) {
        return match.split(' ')[1];
      } else {
        return match;
      }
    });
  }

  reducedTokens.filter(token => token.index < offset).forEach((token) => {
    offset += token[0].length - (token[1].split(' ').length > 1 ? token[1].split(' ')[1] : token[1]).length;
  });

  return `${base.slice(0, offset)}${text}${base.slice(offset)}`;
};

const PERSONALIZABLE_ELEMENT_TYPES = ['text', 'image', 'personalizedImage'];

@inject('api')
@inject('store')
@observer
export default class Editor extends Component {
  @observable
  warning = {
    text: null,
    additionalData: [],
  };

  constructor(props) {
    super(props);

    const { store: { activeProject, project, remix } } = this.props;
    this.toggle = this.toggle.bind(this);
    // this.onActiveProject =  this.onActiveProject.bind(this)
    this.state = { isOpen: false, contentType: '' }
    if (process.browser && !activeProject) {
      if (project || remix) {
        this.retrieveProject(project || remix, !!remix);
      } else {
        Router.push('/');
      }
    }
  }



  state = {
    waiter: null,
    playbackUrl: null,
  };

  async componentDidMount() {
    const { api } = this.props;
    const result = await api.defaults();
    if (result.length) {
      this.setState({ playbackUrl: result[0].url });

    }
  }

  async componentDidUpdate() {
    const { api,store:{ activeProject } } = this.props;
    try {
      if(activeProject.make._id && activeProject.modified) {
        await api.save(activeProject);
      }
    }
    catch(e) {
      console.log(e);
    }
  }
  
  retrieveProject = async (projectId, isRemix) => {
    const { api, store } = this.props;
    const source = await api.get(projectId, !isRemix);
    store.activeProject = isRemix ? Project.fromTemplate(source) : new Project(source);
  };
  toggle(contentType) {
    this.setState({
      isOpen: !this.state.isOpen,
      contentType: contentType
    });
  }
  @action
  setWarning = (options = {}) => () => {
    const { text, additionalData = [] } = options;
    this.warning = { text, additionalData };
  };

  onElementUpdate = (updatedProps) => {
    const { store: { activeProject } } = this.props;
    if (updatedProps) {
      /* eslint-disable no-underscore-dangle */
      activeProject.activeElement._natives._update
        .call(this, activeProject.activeElement, updatedProps);
      activeProject.update(activeProject.activeElement, updatedProps);
    } else {
      activeProject.remove(activeProject.activeElement);
      activeProject.activeElement = null;
    }
    this.checkForm();
  };

  onTokenChosen = (token) => {
    const { store: { activeProject: { activeElement }, activeProject } } = this.props;
    const {
      _activeHandle: { type, target },
      caretOffsets: offset = {},
    } = activeElement;
    const newText = insertAtCaret(activeElement[type], offset[type] || 0, token);

    const event = new Event('input');
    target.dispatchEvent(event);

    const updatedProps = {};
    updatedProps[type] = newText;
    activeElement._natives._update
      .call(this, activeElement, updatedProps);
    activeProject.update(activeElement, updatedProps);
    this.checkForm();
    PopupboxManager.close();
  };

  checkForm = () => {
    const { store: { activeProject } } = this.props;
    this.setWarning(formWarning(activeProject.projectData))();
  };

  render() {
    const {
      api,
      store,
      store: {
        activeProject,
        whiteLabelManager,
        common: {
          features,
        },
        currentUser,
        editorStateManager,
      },
    } = this.props;
    console.log(this.isOpen, "isOpen");
    const { waiter, playbackUrl } = this.state;
    /* eslint-disable no-underscore-dangle */
    const ToolbarEditor = activeProject && activeProject.activeElement
      && PopcornEditor.editors[activeProject.activeElement._natives.type];

    if (process.browser) {
      window.onbeforeunload = () => {
        if (activeProject && activeProject.modified) {
          return confirm('There are unsaved changes, do you want to continue?');
        } else {
          return null;
        }
      };
    }

    return (
      <Fragment>
        <Head>
          <title>
            {activeProject && activeProject.make && activeProject.make._id
              ? `${activeProject.name} - ${whiteLabelManager.brandName}`
              : whiteLabelManager.brandName}
          </title>
        </Head>
        <PopupboxContainer
          ref={(c) => { this.popupboxContainer = c; }}
          onClosed={() => {
            this.popupboxContainer.state.children = null;
          }}
        />
        {activeProject ? (
          <PhaseView
            elements={[
              {
                key: 'getting-started',
                title: ((activeProject && activeProject.usedWizard)
                  || GettingStarted.WIZARD_TYPES.FROM_TEMPLATE).label,
                active: false,
                available: true,
                image: chooseTemplateIcon,
                val: 0
              },
              {
                key: 'edit',
                title: 'Customize Video',
                active: true,
                available: true,
                image: customizeVideoIcon,
                val: 50
              },
              {
                key: 'publish',
                title: 'Publish & Share',
                active: false,
                available: false,
                image: publishShareIcon,
                val: 100
              },
            ]}
            onPhaseChanged={(element) => {
              switch (element.key) {
                case 'getting-started':
                  Router.push({
                    pathname: '/',
                    query: {
                      wizard: ((activeProject && activeProject.usedWizard)
                        || GettingStarted.WIZARD_TYPES.FROM_TEMPLATE).key,
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
          />
        ) : null}
        {waiter ? <Waiter message={waiter.message} /> : null}
        {this.state.isOpen && <VideoPlayer contentType={this.state.contentType} title="Preview" item={activeProject} playbackUrl={playbackUrl} setShow={this.toggle}  onActiveProject={(cta) => this.onActiveProject(cta)} />}
        <Container fluid className={`editor-wrapper project-expector ${activeProject && 'hidden'}`}>
          <InfiniteLoading />
        </Container>
        {activeProject ? (
          <div fluid className={`editor-wrapper ${!activeProject && 'hidden'}`}>

            <div className={`canvas full-height ${editorStateManager.stage === StateManager.STAGE_TYPES.CAPTION_CUSTOMISE || editorStateManager.stage === StateManager.STAGE_TYPES.CALL_TO_ACTION  || editorStateManager.stage === StateManager.STAGE_TYPES.PERSONALIZER || editorStateManager.stage === StateManager.STAGE_TYPES.NICHE_SCRIPT_CUSTOMISE || editorStateManager.stage === StateManager.STAGE_TYPES.END_SCREENS_CUSTOMISE || editorStateManager.stage === StateManager.STAGE_TYPES.IMAGE_LT_CUSTOMISE ? 'with-toolbar' : ''}`}>
              <div className="col-2 paddingless editor-pane sidebar">
                <EditorStageChanger
                  className="stage-wrapper"
                  stage={editorStateManager.stage}
                  onChange={(stage) => {
                    editorStateManager.stage = stage;
                    editorStateManager.toolbar = null;
                  }}
                />
              </div>
              <div className="workspace" key={activeProject && activeProject.version}>
               
                <WorkspaceContainer
                  stateManager={editorStateManager}
                  className="full-height"
                  checkForm={this.checkForm}
                  setWarning={this.setWarning}
                  warning={this.warning}
                  api={api}
                />
                <Row className={`toolbar ${editorStateManager.stage === StateManager.STAGE_TYPES.CAPTION_CUSTOMISE || editorStateManager.stage === StateManager.STAGE_TYPES.CALL_TO_ACTION  || editorStateManager.stage === StateManager.STAGE_TYPES.PERSONALIZER || editorStateManager.stage === StateManager.STAGE_TYPES.NICHE_SCRIPT_CUSTOMISE || editorStateManager.stage === StateManager.STAGE_TYPES.END_SCREENS_CUSTOMISE || editorStateManager.stage === StateManager.STAGE_TYPES.IMAGE_LT_CUSTOMISE ? '' : 'hidden'}`}>
                  {activeProject && activeProject.activeElement ? (
                    <ToolbarEditor
                      element={activeProject && activeProject.activeElement}
                      features={currentUser.features}
                      onElementUpdate={this.onElementUpdate}
                    />
                  ) : (
                    <NewElementBar
                      project={activeProject}
                      features={currentUser.features}
                      checkForm={this.checkForm}
                      defaultImage={whiteLabelManager.shouldOverride ? whiteLabelManager.brandLogo : null}
                    />
                  )}
                </Row>
              </div>
              {/* <Col className="col-2 paddingless editor-pane"> */}
              {/* <ActionsPane className="actions-pane scrollable">
                  <button
                    className="go-button action-button"
                    onClick={() => {
                      this.toggle()
                    }}
                  >
                    Preview
                  </button>
                  <button
                    className="go-button action-button"
                    onClick={async () => {
                      // no need to have it working now, but who knows for future...
                      // if (activeProject.audio) {
                      //   this.setState({
                      //     waiter: {
                      //       message: 'Making your media mobile-friendly...',
                      //     },
                      //   });
                      //   const { url } = await api.mergeMedia(
                      //     activeProject.video,
                      //     activeProject.audio,
                      //   );
                      //   await activeProject.updateAudio(null);
                      //   await activeProject.updateVideo(url);
                      // }
                      this.setState({ waiter: { message: 'Saving your project...' } });
                      const savedProject = await api.publish(await api.save(activeProject));
                      Router.push({
                        pathname: '/publish',
                        query: { project: savedProject.make._id },
                      });
                      this.setState({ waiter: null });
                    }}
                  >
                    Publish & Share
                  </button>
                  <button
                    title={
                      activeProject
                        && activeProject.activeElement
                        && PERSONALIZABLE_ELEMENT_TYPES
                          .indexOf(activeProject.activeElement._natives.type) !== -1
                        ? ''
                        : 'To use personalizer, please select any personalizable element first.'
                    }
                    className={
                      `addon-button ${(activeProject
                        && activeProject.activeElement
                        && PERSONALIZABLE_ELEMENT_TYPES
                          .indexOf(activeProject.activeElement._natives.type) !== -1)
                        ? ''
                        : 'inactive'}`
                    }
                    onClick={() => {
                      if (activeProject && activeProject.activeElement) {
                        this.toggle('personalizer');

                        // this.state.isOpen &&  <VideoPlayer className={'cta-library'} setShow={this.toggle} contentType={'cta'}/>

                    //     PopupboxManager.open({
                          // content: <Personalizer
                          //   className="personalizer"
                          //   onTokenChosen={this.onTokenChosen}
                          // />,
                    //       config: {
                    //         titleBar: {
                    //           enable: true,
                    //           text: 'Personalizer',
                    //         },
                    //         fadeIn: true,
                    //         fadeInSpeed: 200,
                    //       },
                    //     });
                      }
                    }}
                  >
                    <SVGInline className="icon personalizer-icon addon-icon-svg" classSuffix="" svg={SVGPersonalizer} cleanup={['title']} />
                    <span>Personalizer</span>
                  </button>
                  <button
                    className={`addon-button ${(currentUser.features[features.cta] && currentUser.features[features.cta].state === 'enabled') ? '' : 'inactive'}`}
                    title={(currentUser.features[features.cta] && currentUser.features[features.cta].state === 'enabled') ? '' : 'This feature is not available on your type of subscription. Click here to details.'}
                    onClick={() => {
                      if (currentUser.features[features.cta] && currentUser.features[features.cta].state === 'enabled') {
                        this.toggle('CTA');
                        {console.log("call here",this.state.isOpen)}
                        //  <VideoPlayer className={'cta-library'} setShow={this.toggle} contentType='CTA'/>
                        // PopupboxManager.open({
                        //   content: <CallToActions
                        //     className="cta-library"
                            // onCtaSelected={(cta) => {
                            //   activeProject.cta = new Project(cta);
                            //   PopupboxManager.close();
                            // }}
                        //   />,
                        //   config: {
                        //     titleBar: {
                        //       enable: true,
                        //       text: 'CTA Library',
                        //     },
                        //     fadeIn: true,
                        //     fadeInSpeed: 200,
                        //   },
                        // });
                      } else if (currentUser.features[features.cta].link) {
                        window.open(currentUser.features[features.cta].link, '_blank');
                      }
                    }}
                  >
                    <SVGInline className="icon cta-icon addon-icon-svg" classSuffix="" svg={SVGCallToAction} cleanup={['title']} />
                    <span>Call to Action</span>
                  </button>
                  {console.log(currentUser.features, "featutes", features.generator, features.cta)}
                  <button
                    className={`addon-button ${(currentUser.features[features.generator] && currentUser.features[features.generator].state === 'enabled') ? '' : 'inactive'}`}
                    title={(currentUser.features[features.generator] && currentUser.features[features.generator].state === 'enabled') ? '' : 'This feature is not available on your type of subscription. Click here to details.'}
                    onClick={() => {
                      if (currentUser.features[features.generator] && currentUser.features[features.generator].state === 'enabled') {
                        this.toggle('nicheScript');


                        // PopupboxManager.open({
                        //   content: <NicheScriptsWorkspace
                            // className="niche-scripts"
                            // useWaiter
                            // onScriptSelected={async (script) => {
                            //   const regeneratedProject = Project.fromTemplate(script, true);
                            //   await regeneratedProject.updateVideo(activeProject.video);
                            //   regeneratedProject.usedWizard = activeProject.wizardType;
                            //   regeneratedProject.thumbnail = store.common.defaultPosterframe;
                            //   store.activeProject = regeneratedProject;
                            //   activeProject.version = Math.random();
                            //   PopupboxManager.close();
                            // }}
                        //   />,
                        //   config: {
                        //     titleBar: {
                        //       enable: true,
                        //       text: 'Select a niche script',
                        //     },
                        //     fadeIn: true,
                        //     fadeInSpeed: 200,
                        //   },
                        // });
                      } else if (currentUser.features[features.generator].link) {
                        window.open(currentUser.features[features.generator].link, '_blank');
                      }
                    }}
                  >
                    <SVGInline className="icon niche-scripts-icon addon-icon-svg" classSuffix="" svg={SVGNicheScripts} cleanup={['title']} />
                    <span>Niche Scripts</span>
                  </button>
                  {console.log(features.endScreens,currentUser.features)}
                  <button
                    className={`addon-button ${(currentUser.features[features.endScreens] && currentUser.features[features.endScreens].state === 'enabled') ? '' : 'inactive'}`}
                    title={(currentUser.features[features.endScreens] && currentUser.features[features.endScreens].state === 'enabled') ? '' : 'This feature is not available on your type of subscription. Click here to details.'}
                    onClick={() => {
                      if (currentUser.features[features.endScreens] && currentUser.features[features.endScreens].state === 'enabled') {
                        this.toggle('endScreens');
                        // PopupboxManager.open({
                        //   content: <EndScreens
                        //     className="cta-library"
                        //     onCtaSelected={(cta) => {
                        //       activeProject.cta = new Project(cta);
                        //       PopupboxManager.close();
                        //     }}
                        //   />,
                        //   config: {
                        //     titleBar: {
                        //       enable: true,
                        //       text: 'End Screens',
                        //     },
                        //     fadeIn: true,
                        //     fadeInSpeed: 200,
                        //   },
                        // });
                      } else if (currentUser.features[features.cta].link) {
                        window.open(currentUser.features[features.cta].link, '_blank');
                      }
                    }}
                  >
                    <SVGInline className="icon cta-icon addon-icon-svg" classSuffix="" svg={SVGEndScreens} cleanup={['title']} />
                    <span>End Screens</span>
                  </button>
                  <button
                    className={`addon-button ${(currentUser.features[features.imageLT] && currentUser.features[features.imageLT].state === 'enabled') ? '' : 'inactive'}`}
                    title={(currentUser.features[features.imageLT] && currentUser.features[features.imageLT].state === 'enabled') ? '' : 'This feature is not available on your type of subscription. Click here to details.'}
                    onClick={() => {
                      if (currentUser.features[features.imageLT] && currentUser.features[features.imageLT].state === 'enabled') {
                        this.toggle('imageLT');

                        // PopupboxManager.open({
                        //   content: <CallToActions
                        //     className="cta-library"
                        //     onCtaSelected={(cta) => {
                        //       activeProject.cta = new Project(cta);
                        //       PopupboxManager.close();
                        //     }}
                        //   />,
                        //   config: {
                        //     titleBar: {
                        //       enable: true,
                        //       text: 'CTA Library',
                        //     },
                        //     fadeIn: true,
                        //     fadeInSpeed: 200,
                        //   },
                        // });
                      } else if (currentUser.features[features.cta].link) {
                        window.open(currentUser.features[features.cta].link, '_blank');
                      }
                    }}
                  >
                    <SVGInline className="icon cta-icon addon-icon-svg" classSuffix="" svg={SVGImageLTPreset} cleanup={['title']} />
                    <span>Image LT</span>
                  </button>
                </ActionsPane> */}
              {/* </Col> */}
            </div>
          </div>
        ) : null}
      </Fragment>
    );
  }
}
