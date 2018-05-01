import React from 'react';
import PropTypes from '../../lib/PropTypes';

const EmbeddedPlayback = props => (
  <iframe
    id="vr"
    title={props.title}
    src={props.url}
    width={props.width}
    height={props.height}
    frameBorder="0"
    mozallowfullscreen="true"
    webkitallowfullscreen="true"
    allowFullScreen
  />
);

EmbeddedPlayback.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};
export default EmbeddedPlayback;
