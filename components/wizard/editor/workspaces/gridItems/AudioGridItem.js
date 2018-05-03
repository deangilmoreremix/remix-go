import React from 'react';

import PropTypes from '../../../../../lib/PropTypes';

const AudioGridItem = (props) => {
  const { thumbnail } = props.template;
  return (
    <div className="card" style={{ backgroundImage: `url(${thumbnail})` }}>
      <div className="overlay">
        <div className="buttons-container">
          <a className="button button-primary" onClick={() => { props.onUse(props.template); }}>use</a>
        </div>
      </div>
    </div>
  );
};

AudioGridItem.propTypes = {
  template: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
  }),
  onUse: PropTypes.func.isRequired,
};

export default AudioGridItem;
