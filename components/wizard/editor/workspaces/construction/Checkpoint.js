import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import PropTypes from '../../../../../lib/PropTypes';
import { videoResizer } from '../../../../../lib/PopcornProxy';

@inject('store')
@observer
export default class CheckpointsList extends Component {
  static propTypes = {
    className: PropTypes.string,
    at: PropTypes.number.isRequired,
  };

  componentDidMount() {
    const { store, at } = this.props;
    const popcorn = store.activeProject
      .attach(store.activeProject.popcornify(this.popcornWrapper), `video-container-${at}`);
    this.updateSceneSize = videoResizer(this.embedWrapper,
      { padding: 2, ratio: store.activeProject.ratio });
    window.addEventListener('resize', this.sceneResize);
    popcorn.seek(at);
    this.sceneResize();
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
    const { className, at } = this.props;
    return (
      <div className={`thumbnail-container ${className}`}>
        <div
          className="wrapper cf faded embed full-height full-width"
          ref={(c) => { this.embedWrapper = c; }}
        >
          <div id={`video-container-${at}`} className="construction-container" data-butter="target">
            <div ref={(c) => { this.popcornWrapper = c; }} />
          </div>
        </div>
      </div>
    );
  }
}
