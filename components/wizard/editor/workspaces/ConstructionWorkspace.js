import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { inject, observer } from 'mobx-react';

import PropTypes from '../../../../lib/PropTypes';
import ConstructionScene from './construction/ConstructionScene';
import CheckpointsList from './construction/CheckpointsList';
import PopcornEditor from '../../../../lib/popcorn/plugins/editor.popcorn';

@inject('store')
@observer
export default class ConstructionWorkspace extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  state = {
    popcorn: null,
  };

  onPopcornInitialize(wrapper) {
    const { store, store: { activeProject }, onComponentChanged } = this.props;
    const popcorn = store.activeProject.attach(store.activeProject.popcornify(wrapper));
    this.setState({ popcorn });
    popcorn.on('elementSelected', (event) => {
      const { element } = event;
      activeProject.activeElement = element;
    });
    popcorn.on('elementUpdated', (event) => {
      const { element, options } = event;
      /* eslint-disable no-underscore-dangle */
      element._natives._update.call(this, element, options);
      activeProject.update(element, options);
      onComponentChanged();
    });
  }

  onProjectSeek(at) {
    const { popcorn } = this.state;
    popcorn.currentTime(at);
  }

  render() {
    const { className } = this.props;
    return (
      <Container className={`construction-workspace ${className || ''}`}>
        <ConstructionScene
          onPopcornInitialize={popcornWrapper => this.onPopcornInitialize(popcornWrapper)}
        />
        <CheckpointsList
          className="construction-thumbnails"
          onCheckpointSelect={at => this.onProjectSeek(at)}
        />
      </Container>
    );
  }
}
