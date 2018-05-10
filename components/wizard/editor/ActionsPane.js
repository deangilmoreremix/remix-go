import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { observer } from 'mobx-react';

import PropTypes from '../../../lib/PropTypes';

@observer
export default class ActionsPane extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  render() {
    const { className } = this.props;
    return (
      <Container className={className}>
        <button className="go-button action-button">Preview</button>
        <button className="go-button action-button">Publish & Share</button>
      </Container>
    );
  }
}
