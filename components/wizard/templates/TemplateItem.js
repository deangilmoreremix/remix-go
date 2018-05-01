import React from 'react';

import PropTypes from '../../../lib/PropTypes';

const TemplateItem = (props) => {
  const { title, thumbnail, url } = props.template;
  return (
    <div key={props.key} className="card" style={{'background-image': `url(${thumbnail})`}}>
      <div className="overlay">
      </div>
    </div>
  );
};

TemplateItem.propTypes = {
  template: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
  }),
};

export default TemplateItem;