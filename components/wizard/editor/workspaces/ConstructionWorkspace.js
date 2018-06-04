import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { inject, observer } from 'mobx-react';

import PropTypes from '../../../../lib/PropTypes';
import ConstructionScene from './construction/ConstructionScene';
import CheckpointsList from './construction/CheckpointsList';

@inject('store')
@observer
export default class ConstructionWorkspace extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  state = {
    popcorn: null,
  };

  componentWillUnmount() {
    const { store: { activeProject } } = this.props;
    activeProject.activeElement = null;
  }

  onPopcornInitialize(wrapper) {
    const { store, store: { activeProject } } = this.props;
    const popcorn = store.activeProject.attach(
      store.activeProject.popcornify(wrapper),
      wrapper.parentNode.id,
    );
    this.setState({ popcorn });
    popcorn.on('elementSelected', (event) => {
      const { element } = event;
      activeProject.activeElement = element;
    });
    popcorn.on('elementUpdated', (event) => {
      const { element, options } = event;
      activeProject.update(element, options);
    });
    popcorn.currentTime(activeProject.checkpoints[0]);
  }

  onProjectSeek(at) {
    const { popcorn } = this.state;
    const { store: { activeProject } } = this.props;
    popcorn.currentTime(at);
    activeProject.currentCheckpoint = at;
  }

  render() {
    const { className, store: { activeProject } } = this.props;
    if (!activeProject) {
      return null;
    }
    return (
      <Container
        className={`construction-workspace ${className || ''}`}
        onClick={() => {
          activeProject.activeElement = null;
        }}
      >
        <ConstructionScene
          onPopcornInitialize={popcornWrapper => this.onPopcornInitialize(popcornWrapper)}
        />
        <CheckpointsList
          className="construction-thumbnails"
          checkpoints={activeProject.checkpoints}
          onCheckpointSelect={at => this.onProjectSeek(at)}
        />
      </Container>
    );
  }
}
