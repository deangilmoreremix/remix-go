import React from 'react';

import PropTypes from '../../../lib/PropTypes';

const NicheScriptItem = (props) => {
  const { script, script: { title, description }, onUse } = props;
  console.log(title, "title", description)
  return (
    <div className='niche-item'>
      <div className='niche-details'>
        <div className="script-title">{title}</div>
        <div className='script-discription'>{description}afdggtgshfgdhsfghfghgfhsjgsjsgjdg</div>
      </div>
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
