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
    const { store, store: { editorStateManager } } = this.props;
    const popcorn = store.activeProject.attach(store.activeProject.popcornify(wrapper));
    this.setState({ popcorn });
    popcorn.on('elementSelected', (event) => {
      const { type, element } = event;
      const Editor = PopcornEditor.editors[type];
      console.log('element type is ', type);
      editorStateManager.toolbar = <Editor element={element} />;
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
