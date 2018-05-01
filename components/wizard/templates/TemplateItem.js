import React from 'react';

import PropTypes from '../../../lib/PropTypes';

const TemplateItem = (props) => {
  const { title, thumbnail, url } = props.template;
  return (
    <div className="card" style={{backgroundImage: `url(${thumbnail})`}}>
      <div className="overlay">
        <div className="buttons-container">
          <a className="button" onClick={() => { props.onPreview(props.template) }}>preview</a>
          <a className="button button-primary" onClick={() => { props.onUse(props.template)}}>use</a>
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