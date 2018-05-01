import React from 'react';

const TemplateItem = (props) => {
  return (
    <div key={props.key} className="card" style={{background: '#EF5350', height: props.height}}>
      {props.title}
    </div>
  );
};

export default TemplateItem;
