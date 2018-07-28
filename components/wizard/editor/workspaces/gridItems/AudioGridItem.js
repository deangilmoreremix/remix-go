import React from 'react';

import PropTypes from '../../../../../lib/PropTypes';

const AudioGridItem = (props) => {
  const { onPreview, onUse, artwork, title, url } = props;
  const testAW = 'https://cdn.vidcloud.io/resources/go/audios/laughing-female-friends-with-ukuleles_23-2147829691.jpg';
  return (
    <div className="card" style={{ backgroundImage: `url(${testAW || '/static/images/editor/default-artwork.png'})` }}>
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
