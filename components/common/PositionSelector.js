import React from 'react';
import PropTypes from '../../lib/PropTypes';

const VERTICALS = ['top', 'middle', 'bottom'];
const HORIZONTALS = ['left', 'center', 'right'];

const PositionSelector = (props) => {
  const {
    className,
    position,
    onPositionChanged,
  } = props;
  return (
    <div className={`position-selector ${className}`}>
      {VERTICALS.map((vrt, vidx) => (
        <div key={vidx} className="position-selector-row">
          {HORIZONTALS.map((hrz, hidx) => (
            <div
              key={hidx}
              className={`position-selector-cell ${
                (vrt === position.vertical && hrz === position.horizontal) ? 'active' : ''
              }`}
              onClick={() => onPositionChanged({ vertical: vrt, horizontal: hrz })}
            />
          ))}
        </div>
      ))}
    </div>);
};

PositionSelector.propTypes = {
  className: PropTypes.string,
  position: PropTypes.shape({
    vertical: PropTypes.oneOf(VERTICALS).isRequired,
    horizontal: PropTypes.oneOf(HORIZONTALS).isRequired,
  }).isRequired,
  onPositionChanged: PropTypes.func.isRequired,
};

export default PositionSelector;
