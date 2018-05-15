import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { inject, observer } from 'mobx-react';

import PropTypes from '../../../lib/PropTypes';

@inject('api')
@inject('store')
@observer
export default class ActionsPane extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  render() {
    const { className, api, store: { activeProject } } = this.props;
    return (
      <Container className={className}>
        <button className="go-button action-button">Preview</button>
        <button
          className="go-button action-button"
          onClick={() => api.save(activeProject)}
        >Publish & Share
        </button>
      </Container>
    );
  }
}
