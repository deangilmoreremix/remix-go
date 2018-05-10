import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { videoResizer } from '../../../../../lib/PopcornProxy';
import PropTypes from '../../../../../lib/PropTypes';

const POPCORN_WRAPPER_ID = 'video';

@inject('store')
@observer
export default class ConstructionScene extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  state = {
    popcorn: null,
  };

  componentDidMount() {
    const { store } = this.props;

    if (process.browser) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ popcorn: store.activeProject.popcornify(POPCORN_WRAPPER_ID) });
      store.activeProject.attach(this.state.popcorn);
      this.updateSceneSize = videoResizer(this.embedWrapper);
      window.addEventListener('resize', this.updateSceneSize.bind(this));
      this.updateSceneSize();
    }
  }

  componentDidUnmount() {
    window.removeEventListener('resize', this.updateSceneSize.bind(this));
  }

  render() {
    const { className } = this.props;
    return (
      <div className={`full-height full-width ${className || ''}`}>
        <div
          className="wrapper cf faded embed full-height full-width"
          ref={(c) => { this.embedWrapper = c; }}
        >
          <div id="video-container" className="construction-container" data-butter="target">
            <div id={POPCORN_WRAPPER_ID} />
          </div>
        </div>
      </div>
    );
  }
}
