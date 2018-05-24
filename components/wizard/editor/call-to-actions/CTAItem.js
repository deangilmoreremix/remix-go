import React from 'react';

import PropTypes from '../../../../lib/PropTypes';

const CTAItem = (props) => {
  const { thumbnail } = props.cta;
  return (
    <div className="card" style={{ backgroundImage: `url(${thumbnail})` }}>
      <div className="overlay">
        <div className="buttons-container">
          <a className="button button-primary" onClick={() => { props.onUse(props.cta); }}>use</a>
        </div>
      </div>
    </div>
  );
};

CTAItem.propTypes = {
  cta: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
  }),
  onUse: PropTypes.func.isRequired,
};

export default CTAItem;
