import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { inject, observer } from 'mobx-react';

import PropTypes from '../../../../../lib/PropTypes';
import Checkpoint from './Checkpoint';

@inject('store')
@observer
export default class CheckpointsList extends Component {
  static propTypes = {
    className: PropTypes.string,
    onCheckpointToggle: PropTypes.func.isRequired,
  };

  render() {
    const { className, store: { activeProject } } = this.props;
    return (
      <Container className={`full-height full-width ${className || ''}`} style={{ background: '#ffff00' }}>
        <ul>
          {activeProject.elements.map((item, idx) => (
            <li key={idx}>
              <Checkpoint />
            </li>
            ))}
        </ul>
      </Container>
    );
  }
}
