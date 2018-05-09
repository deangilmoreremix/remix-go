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
    const getCheckpoints = () => {
      let result = [];
      activeProject.elements.forEach(({ popcornOptions: { start } }) => {
        if (result.indexOf(start) === -1) {
          result.push(start);
        }
      });
      return result.sort();
    };
    return (
      <Container className={`full-height full-width ${className || ''}`} style={{ background: '#ffff00' }}>
        <ul>
          {getCheckpoints().map((item, idx) => (
            <li key={idx}>
              <Checkpoint at={item} />
            </li>
            ))}
        </ul>
      </Container>
    );
  }
}
