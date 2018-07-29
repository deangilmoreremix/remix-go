import React from 'react';

import PropTypes from '../../../../../lib/PropTypes';

const AudioGridItem = (props) => {
  const { onPreview, onUse, artwork, title, url } = props;
  return (
    <div className="card" style={{ backgroundImage: `url(${artwork || '/static/images/editor/default-artwork.png'})` }}>
      <div className="overlay">
        <div className="buttons-container preview">
          <a className="button btn-preview" onClick={() => onPreview(title, url)}>
            <i className="fa fa-play"></i>
          </a>
          <p>{title}</p>
          <a className="button button-primary btn-use" onClick={() => onUse(url)}>use</a>
        </div>
      </div>
    </div>
  );
};

AudioGridItem.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  artwork: PropTypes.string,
  onPreview: PropTypes.func.isRequired,
  onUse: PropTypes.func.isRequired,
};

export default AudioGridItem;
