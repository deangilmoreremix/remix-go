import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import PropTypes from '../../../../../lib/PropTypes';

@inject('store')
@observer
export default class ConstructionScene extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  componentDidMount() {
    const { store } = this.props;

    if (process.browser) {
      store.activeProject.attach(store.activeProject.popcornify());
    }
  }

  render() {
    const { className } = this.props;
    return (
      <div id="embed-wrapper" className={`wrapper cf faded embed full-height full-width ${className || ''}`}>
        <div id="video-container" className="construction-container" data-butter="target">
          <div id="video" />
        </div>
      </div>
    );
  }
}
