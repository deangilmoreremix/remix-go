import React, { Component } from 'react';

import PropTypes from '../../../../../lib/PropTypes';

export default class VideoGridItem extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    preview: PropTypes.string.isRequired,
    onPreview: PropTypes.func.isRequired,
    onUse: PropTypes.func.isRequired,
  };

  togglePreview = (state) => {
    if (this.previewContainer.parentNode.querySelector('video')) {
      this.previewContainer.parentNode.querySelector('video')[state ? 'play' : 'pause']();
    }
  };

  render() {
    const { onPreview, onUse, title, url, preview } = this.props;
    return (
      <div className="card video-item">
        <video
          className="video"
          preload="true"
          ref={(c) => { this.previewContainer = c; }}
          loop
          muted
        >
          <source src={preview} type="video/webm" />
        </video>
        <div
          className="overlay"
          onMouseOver={() => this.togglePreview(true)}
          onMouseOut={() => this.togglePreview(false)}
        >
          <div
            className="buttons-container"
            onMouseOver={() => this.togglePreview(true)}
          >
            <a className="button btn-preview" onClick={() => { onPreview(title, url); }}>
              <i className="fa fa-play" />
            </a>
            {/*<p*/}
              {/*onMouseOver={() => this.togglePreview(true)}*/}
            {/*>*/}
              {/*{title}*/}
            {/*</p>*/}
            <a className="button button-primary" onClick={() => onUse(url)}>use</a>
          </div>
        </div>
      </div>
    );
  }
}
