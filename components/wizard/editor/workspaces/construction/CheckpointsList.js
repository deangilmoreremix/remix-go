import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { observer } from 'mobx-react';

import PropTypes from '../../../../../lib/PropTypes';
import Checkpoint from './Checkpoint';

@observer
export default class CheckpointsList extends Component {
  static propTypes = {
    className: PropTypes.string,
    onCheckpointToggle: PropTypes.func.isRequired,
    popcorn: PropTypes.any.isRequired,
  };

  render() {
    const { className, popcorn } = this.props;
    return (
      <Container className={`full-height full-width ${className || ''}`} style={{ background: '#ffff00' }}>
        <ul>
          {popcorn.trackEvents.byStart.map((item, idx) => (
            <li key={idx}>
              <Checkpoint />
            </li>
            ))}
        </ul>
      </Container>
    );
  }
}
