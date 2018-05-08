import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { observer } from 'mobx-react';

import PropTypes from '../../../../../lib/PropTypes';

@observer
export default class ThumbnailsList extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  render() {
    const { className } = this.props;
    return (
      <Container className={`full-height full-width ${className || ''}`} style={{background: '#ffff00'}}>
      </Container>
    );
  }
}
