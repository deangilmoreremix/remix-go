import React, { Fragment } from 'react';
import PropTypes from '../../../../lib/PropTypes';
import EmbeddedPlayback from '../../../common/EmbeddedPlayback';
// import { useState } from 'react';

const ImageLTItem = (props) => {
  const { onClick, activeItem } = props;
  const { thumbnail, title, contenturl, _id } = props.cta;
  return (
    <Fragment>
      <div onClick={() => onClick(props.cta)} className={activeItem._id == _id ? 'image-lt-item-active' : 'image-lt-item'}>
        {title}
      
      </div>
    </Fragment>
  );
};

ImageLTItem.propTypes = {
  cta: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
  }),
  // onUse: PropTypes.func.isRequired,
};

export default ImageLTItem;
