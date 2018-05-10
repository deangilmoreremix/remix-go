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

  onProjectSeek(at) {
    const { popcorn } = this.state;
    popcorn.currentTime(at);
  }

  render() {
    const { store, className } = this.props;
    return (
      <Container className={`construction-workspace ${className || ''}`}>
        <ConstructionScene
          onPopcornInitialize={(popcornWrapper) => {
            this.setState({
              popcorn: store.activeProject
                .attach(store.activeProject.popcornify(popcornWrapper)),
            });
          }}
        />
        <CheckpointsList
          className="construction-thumbnails"
          onCheckpointSelect={at => this.onProjectSeek(at)}
        />
      </Container>
    );
  }
}
