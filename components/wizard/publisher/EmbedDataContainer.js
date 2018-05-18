import React from 'react';

import PropTypes from '../../../lib/PropTypes';

const EmbedDataContainer = (props) => {
  const { url, className } = props;
  return (
    <textarea className={className} readOnly rows={4}>
      {`<script>var vars={};var tempstring='';var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value){if(value){tempstring+=key+'='+value+'&';}});if (tempstring) {document.addEventListener('DOMContentLoaded',function() {document.getElementById('vr').src='${url}?'+tempstring.slice(0, -1);});}</script>\r<iframe id='vr' src='${url}' width='${560}' height='${358}' frameborder='0' mozallowfullscreen webkitallowfullscreen allowfullscreen></iframe>`}
    </textarea>
  );
};

EmbedDataContainer.propTypes = {
  className: PropTypes.string,
  url: PropTypes.string.isRequired,
};

export default EmbedDataContainer;
