import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { videoResizer } from '../../../../../lib/PopcornProxy';
import PropTypes from '../../../../../lib/PropTypes';

@inject('store')
@observer
export default class ConstructionScene extends Component {
  static propTypes = {
    className: PropTypes.string,
    onPopcornInitialize: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { onPopcornInitialize, store } = this.props;

    if (process.browser) {
      onPopcornInitialize(this.popcornWrapper);
      this.updateSceneSize = videoResizer(this.embedWrapper, { ratio: store.activeProject.ratio });
      window.addEventListener('resize', this.sceneResize);
      this.sceneResize();
    }
  }

  componentWillUnmount() {
    if (process.browser) {
      window.removeEventListener('resize', this.sceneResize);
    }
  }

  sceneResize = () => {
    this.updateSceneSize();
  };

  render() {
    const { className } = this.props;
    return (
      <div className={`full-height full-width ${className || ''}`}>
        <div
          className="wrapper cf faded embed full-height full-width"
          ref={(c) => { this.embedWrapper = c; }}
        >
          <div id="video-container-scene" className="construction-container" data-butter="target">
            <div ref={(c) => { this.popcornWrapper = c; }} />
          </div>
        </div>
      </div>
    );
  }
}
