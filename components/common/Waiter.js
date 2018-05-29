import React from 'react';
import PropTypes from '../../lib/PropTypes';

const Waiter = (props) => {
  const { className, message } = props;
  return (
    <div className={`load-waiter ${className}`}>
      <div className="spinner" />
      <span className="message">{message || ''}</span>
    </div>);
};

Waiter.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
};

export default Waiter;
