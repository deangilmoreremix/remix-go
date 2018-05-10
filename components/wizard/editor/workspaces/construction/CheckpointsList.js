import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { inject, observer } from 'mobx-react';

import PropTypes from '../../../../../lib/PropTypes';
import Project from '../../../../../lib/editor/Project';
import Checkpoint from './Checkpoint';

@inject('store')
@observer
export default class CheckpointsList extends Component {
  static propTypes = {
    className: PropTypes.string,
    onCheckpointSelect: PropTypes.func.isRequired,
    // onCheckpointToggle: PropTypes.func.isRequired,
  };

  render() {
    const { className, store: { activeProject }, onCheckpointSelect } = this.props;
    const getCheckpoints = () => {
      const result = [];
      activeProject.elements.forEach(({ type, popcornOptions: { start } }) => {
        if (result.indexOf(start) === -1 && Project.EditableElementTypes.indexOf(type) !== -1) {
          result.push(start);
        }
      });
      return result.sort((a, b) => a - b);
    };
    return (
      <Container className={`full-height full-width ${className || ''}`}>
        <div className="thumbnail-canvas">
          <div className="thumbnail-canvas-scroll">
            {getCheckpoints().map((item, idx) => (
              <div key={idx} className="thumbnail-wrapper" onClick={() => onCheckpointSelect(item)}>
                <Checkpoint at={item} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    );
  }
}
