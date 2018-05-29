import React from 'react';
import PropTypes from '../../lib/PropTypes';

const Zoomer = (props) => {
  const {
    className,
    value,
    onValueChanged,
  } = props;
  return (
    <div className={`zoomer ${className}`}>
      <img
        className="icon zoom-out"
        src="/static/images/editor/elements/image/zoom_out.svg"
        alt="Zoom Out"
        onClick={() => onValueChanged(Math.max(value - 5, 50))}
      />
      <input
        className="slider"
        type="range"
        min={50}
        max={150}
        step={1}
        value={value}
        onChange={({ target: { value: val } }) => onValueChanged(val)}
      />
      <img
        className="icon zoom-in"
        src="/static/images/editor/elements/image/zoom_in.svg"
        alt="Zoom In"
        onClick={() => onValueChanged(Math.min(value + 5, 150))}
      />
    </div>);
};

Zoomer.propTypes = {
  className: PropTypes.string,
  value: PropTypes.number.isRequired,
  onValueChanged: PropTypes.func.isRequired,
};

export default Zoomer;
