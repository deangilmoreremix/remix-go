import React from 'react';
import ReactTooltip from 'react-tooltip';

import PropTypes from '../../../lib/PropTypes';

const TEXT_TOOLTIP = {
  Video: 'Click to change Video',
  Audio: 'Click to change Audio',
  Captions: 'Click to edit Captions',
};

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
      <ReactTooltip
        id={title + 1}
        place="top"
        effect="solid"
        delayShow={500}
        delayHide={600}
      />
      <div
        data-tip={TEXT_TOOLTIP[title]}
        data-for={title + 1}
      >
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
