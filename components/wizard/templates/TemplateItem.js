import React from 'react';

import PropTypes from '../../../lib/PropTypes';

const TemplateItem = (props) => {
  const { template, onPreview, onUse, template: { thumbnail, title } } = props;
  return (
    <div className="card" style={{ backgroundImage: `url(${thumbnail})` }}>
      <div className="overlay">
        <div className="buttons-container">
          <a className="button btn-preview" onClick={() => { onPreview(template); }}>
            <i className="fa fa-play" />
          </a>
          <p>{title}</p>
          <a className="button button-primary" onClick={() => { onUse(template); }}>use</a>
        </div>
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
  onPreview: PropTypes.func.isRequired,
  onUse: PropTypes.func.isRequired,
};

export default TemplateItem;
