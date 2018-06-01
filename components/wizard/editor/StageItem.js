import React from 'react';

import PropTypes from '../../../lib/PropTypes';

const StageItem = (props) => {
  const { className, image, title, onClick, validationMessage } = props;
  return (
    <div
      title={validationMessage || ''}
      className={`${className} ${validationMessage ? 'inactive' : ''}`}
      onClick={() => {
        if (!validationMessage) {
          onClick();
        }
      }}
    >
      <div>
        {image}
        <br />
        <span>{title}</span>
      </div>
    </div>
  );
};

StageItem.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  image: PropTypes.element.isRequired,
  validationMessage: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default StageItem;
