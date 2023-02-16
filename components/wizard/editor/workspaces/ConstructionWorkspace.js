import React, { Component, Fragment } from 'react';
import { Container } from 'reactstrap';
import { inject, observer } from 'mobx-react';

import PropTypes from '../../../../lib/PropTypes';
import ConstructionScene from './construction/ConstructionScene';
import CheckpointsList from './construction/CheckpointsList';
import VideoPlayer from '../../../common/VideoPlayer';
import Project from '../../../../lib/editor/Project';
import PublishButton from '../../../common/PublishButton';

@inject('store')
@observer
export default class ConstructionWorkspace extends Component {
  static propTypes = {
    className: PropTypes.string,
    checkForm: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {

      isOpen: false,
      contentType: '',
      title: ''
    };
  }

  state = {
    popcorn: null,
  }

  componentWillUnmount() {
    const { api, store: { activeProject, editorStateManager } } = this.props;
    this.resignActiveElement();
    activeProject.engines.forEach(engine => activeProject.detach(engine));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stage == 'PERSONALIZER_CUSTOMISE' || nextProps.stage == 'NICHE_SCRIPT_CUSTOMISE' || nextProps.stage == 'END_SCREENS_CUSTOMISE' || nextProps.stage == 'IMAGE_LT_CUSTOMISE' || nextProps.stage == 'CALL_TO_ACTION') {
      this.toggle(nextProps.stage)
      if (nextProps.stage == 'PERSONALIZER_CUSTOMISE') {
        this.setState({
          title: 'Personalizer'
        })
      }
      if (nextProps.stage == 'NICHE_SCRIPT_CUSTOMISE') {
        this.setState({
          title: 'Select a niche script'
        })
      }
      if (nextProps.stage == 'CALL_TO_ACTION') {
        this.setState({
          title: 'CTA Library'
        })
      }
      if (nextProps.stage == 'END_SCREENS_CUSTOMISE') {
        this.setState({
          title: 'End Screens'
        })
      }
      if (nextProps.stage == 'IMAGE_LT_CUSTOMISE') {
        this.setState({
          title: 'Image LT Preset'
        })
      }

    }
    // this.setState({contentType:nextProps.stage});
  }

  componentDidMount(PrevState) {
    console.log(PrevState, "PrevState")
  }
  toggle(contentType) {
    const { store: { editorStateManager } } = this.props;

    if (contentType == 'PERSONALIZER_CUSTOMISE' || contentType == 'NICHE_SCRIPT_CUSTOMISE' || contentType == 'END_SCREENS_CUSTOMISE' || contentType == 'IMAGE_LT_CUSTOMISE' || contentType == 'CALL_TO_ACTION') {
      this.setState({
        isOpen: !this.state.isOpen,
        contentType: contentType == this.state.contentType ? "" : contentType
      })

      if (this.state.isOpen == true) {
        editorStateManager.stage = 'CAPTION_CUSTOMISE';
      }
    }
  }

  onPopcornInitialize(wrapper) {
    const { store, store: { activeProject, currentUser }, checkForm, stage } = this.props;
    activeProject.engines = [];
    const popcorn = store.activeProject.popcornify(wrapper);
    popcorn.main = true;
    popcorn.currentUser = currentUser;
    store.activeProject.attach(popcorn, wrapper.parentNode.id);
    this.setState({ popcorn });
    popcorn.on('elementSelected', (event) => {
      const { element } = event;
      activeProject.activeElement = element;
    });
    popcorn.on('elementUpdated', (event) => {
      const { element, options } = event;
      activeProject.update(element, options);
      checkForm();
    });
    popcorn.seek(activeProject.checkpoints[0]);
    [activeProject.currentCheckpoint] = activeProject.checkpoints;
  }

  onProjectSeek(at) {
    const { popcorn } = this.state;
    const { store: { activeProject } } = this.props;
    popcorn.seek(at);
    activeProject.currentCheckpoint = at;
  }

  resignActiveElement() {
    const { store: { activeProject } } = this.props;
    const { popcorn } = this.state;
    activeProject.activeElement = null;
    if (popcorn) {
      popcorn.emit('elementSelected', { element: null });
    }
  }

  render() {
    const { api, className, store: { activeProject, editorStateManager }, store } = this.props;
    if (!activeProject) {
      return null;
    }
    return (
      <Fragment>
        <PublishButton activeProject={activeProject} api={api} />
        <Container
          className={`construction-workspace ${className || ''}`}
          onClick={() => this.resignActiveElement()}
        >
          {this.state.isOpen && <VideoPlayer isOpen={this.state.isOpen} title={this.state.title} item={activeProject} contentType={this.state.contentType} setShow={this.toggle} store={store} activeProject={activeProject} onActiveProject={(cta) => {
            activeProject.cta = new Project(cta)
          }} />}
          <ConstructionScene
            onPopcornInitialize={popcornWrapper => this.onPopcornInitialize(popcornWrapper)}
          />
          <CheckpointsList
            className="construction-thumbnails"
            checkpoints={activeProject.checkpoints}
            onCheckpointSelect={at => this.onProjectSeek(at)}
          />
        </Container>
      </Fragment>
    );
  }
}
