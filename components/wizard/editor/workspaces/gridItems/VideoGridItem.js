import React from 'react';

import PropTypes from '../../../../../lib/PropTypes';

const VideoGridItem = (props) => {
  const togglePreview = (target, state) => {
    if (target.parentNode.querySelector('video')) {
      target.parentNode.querySelector('video')[state ? 'play' : 'pause']();
    }
  };
  const { onPreview, onUse, title, url, preview } = props;
  return (
    <div className="card video-item">
      <video
        className="video"
        preload="true"
        loop
        muted
      >
        <source src={preview} type="video/webm" />
      </video>
      <div
        className="overlay"
        onMouseOver={({ target }) => togglePreview(target, true)}
        onMouseOut={({ target }) => togglePreview(target, false)}
      >
        <div className="buttons-container">
          <a className="button" onClick={() => { onPreview(title, url); }}>preview</a>
          <a className="button button-primary" onClick={() => onUse(url)}>use</a>
        </div>
      </div>
    </div>
  );
};

VideoGridItem.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  preview: PropTypes.string.isRequired,
  onPreview: PropTypes.func.isRequired,
  onUse: PropTypes.func.isRequired,
};

export default VideoGridItem;
