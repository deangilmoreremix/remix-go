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
      <div>{at}</div>
    );
  }
}
