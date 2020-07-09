import React from 'react';
import { observer } from 'mobx-react';

import PropTypes from '../lib/PropTypes';

const CustomConfirm = observer(({ onButtonClicked }) => (
  <div className="container-confirm">
    <button className="container-confirm-btn" onClick={() => onButtonClicked(true)}>Ok</button>
    <button className="container-confirm-btn" onClick={() => onButtonClicked(false)}>Cancel</button>
  </div>));

CustomConfirm.propTypes = {
  onButtonClicked: PropTypes.func.isRequired,
};

export default CustomConfirm;
