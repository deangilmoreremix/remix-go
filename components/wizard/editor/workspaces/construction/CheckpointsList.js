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
    checkpoints: PropTypes.arrayOf(PropTypes.number),
    onCheckpointSelect: PropTypes.func.isRequired,
  };

  render() {
    const { className, checkpoints, onCheckpointSelect } = this.props;
    return (
      <div className={`thumbnail-canvas full-height full-width ${className || ''}`}>
        <div className="thumbnail-canvas-scroll">
          {checkpoints.map((item, idx) => (
            <div key={idx} className="thumbnail-wrapper" onClick={() => onCheckpointSelect(item)}>
              <Checkpoint at={item} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
