import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import PropTypes from '../../../../../lib/PropTypes';

@inject('store')
@observer
export default class VideoGridItem extends Component {
  static propTypes = {
    item: PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string.isRequired,
      preview: PropTypes.string.isRequired,
    }),
    onPreview: PropTypes.func,
    onUse: PropTypes.func.isRequired,
  };

  togglePreview = (state) => {
    if (this.previewContainer
      && this.previewContainer.parentNode
      && this.previewContainer.parentNode.querySelector('video')) {
      this.previewContainer.parentNode.querySelector('video')[state ? 'play' : 'pause']();
    }
  };

  render() {
    const { onPreview, onUse, item: { url, preview, title } } = this.props;
    return (
      <div className="card video-item" style={{ backgroundImage: `url(${preview ? '' : '/static/images/editor/default-video-preview.png'})` }}>
        {preview &&
          <video
            className="video"
            preload="true"
            ref={(c) => { this.previewContainer = c; }}
            loop
            muted
          >
            <source src={preview || url} type="video/webm" />
          </video>
        }
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
            <p className="title">{title}</p>
            <a className="button button-primary" onClick={() => onUse(url)}>use</a>
          </div>
        </div>
      </div>
    );
  }
}
