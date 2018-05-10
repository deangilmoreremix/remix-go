import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { observer } from 'mobx-react';

import PropTypes from '../../../../../lib/PropTypes';

@observer
export default class CheckpointsList extends Component {
  static propTypes = {
    className: PropTypes.string,
    at: PropTypes.number.isRequired,
  };

  render() {
    const { className, at } = this.props;
    return (
      <div style={{width: '100%', height: '100%', background: '#ff0000', position: 'relative'}}>{at}</div>
    );
  }
}
