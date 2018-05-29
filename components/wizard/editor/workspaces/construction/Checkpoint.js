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
    this.updateSceneSize = videoResizer(this.embedWrapper, 2);
    window.addEventListener('resize', this.updateSceneSize.bind(this));
    window.addEventListener('layoutUpdated', this.updateSceneSize.bind(this));
    this.updateSceneSize();
    popcorn.currentTime(at);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSceneSize.bind(this));
  }

  render() {
    const { className, at } = this.props;
    return (
      <div className={`thumbnail-container ${className}`} style={{width: '100%', height: '100%', position: 'relative'}}>
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
