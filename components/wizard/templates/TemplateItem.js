import React from 'react';

const TemplateItem = (props) => {
  return (
    <div key={props.key} className="card" style={{background: props.color, height: props.height}}>
    </div>
  );
};

export default TemplateItem;
