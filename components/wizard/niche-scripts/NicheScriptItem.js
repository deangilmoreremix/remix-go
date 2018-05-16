import React from 'react';

import PropTypes from '../../../lib/PropTypes';

const NicheScriptItem = (props) => {
  const { script, script: { title }, onUse } = props;
  return (
    <div className="list-item">
      <div className="script-title">{title}</div>
      <a className="go-button" onClick={() => { onUse(script); }}>use</a>
    </div>
  );
};

NicheScriptItem.propTypes = {
  script: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  onUse: PropTypes.func.isRequired,
};

export default NicheScriptItem;
