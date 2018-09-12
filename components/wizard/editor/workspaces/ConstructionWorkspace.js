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
    this.resignActiveElement();
  }

  onPopcornInitialize(wrapper) {
    const { store, store: { activeProject } } = this.props;
    activeProject.engines = [];
    const popcorn = store.activeProject.attach(
      store.activeProject.popcornify(wrapper),
      wrapper.parentNode.id,
    );
    popcorn.main = true;
    this.setState({ popcorn });
    popcorn.on('elementSelected', (event) => {
      const { element } = event;
      activeProject.activeElement = element;
    });
    popcorn.on('elementUpdated', (event) => {
      const { element, options } = event;
      console.log(event);
      activeProject.update(element, options);
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
    const { className, store: { activeProject } } = this.props;
    if (!activeProject) {
      return null;
    }
    return (
      <Container
        className={`construction-workspace ${className || ''}`}
        onClick={() => this.resignActiveElement()}
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
