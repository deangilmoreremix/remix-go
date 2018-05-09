import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { observer } from 'mobx-react';

import PropTypes from '../../../../lib/PropTypes';
import ConstructionScene from './construction/ConstructionScene';
import CheckpointsList from './construction/CheckpointsList';

@observer
export default class ConstructionWorkspace extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  state = {
    popcornData: null,
  };

  render() {
    const { className } = this.props;
    return (
      <Container className={`construction-workspace ${className || ''}`}>
        <ConstructionScene />
        {/*<CheckpointsList className="construction-thumbnails" />*/}
      </Container>
    );
  }
}
