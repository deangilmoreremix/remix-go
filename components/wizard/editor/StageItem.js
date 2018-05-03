import React from 'react';

import PropTypes from '../../../lib/PropTypes';

const StageItem = (props) => {
  const { className, image, title, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
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
  onClick: PropTypes.func.isRequired,
};

export default StageItem;
