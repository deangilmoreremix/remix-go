import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Input } from 'reactstrap';
import DropZone from 'react-dropzone';

import PropTypes from '../../lib/PropTypes';

@inject('api')
@observer
export default class VideoUpload extends Component {
  static propTypes = {
    onVideoUploaded: PropTypes.func.isRequired,
  };

  state = {
    file: null,
    url: null,
    isUploading: false,
  };

  render() {
    const { onVideoUploaded, api } = this.props;
    return (
      <div className="video-upload-box">
        <DropZone
          className="upload-dropzone"
          onDrop={file => console.log(`file dropped ${file}`)}
          accept="image/png"
        >
          <div className="dropzone-inner">
            <img className="icon" src="../../static/images/upload.png" alt="Video upload" />
            <h5 className="label">Click or drag your file here to start uploading it</h5>
          </div>
        </DropZone>
        <h5>or use link to external video hosting (YouTube, Vimeo, etc)</h5>
        <Input className="external-video-link" type="text" />
        <button className="go-button external-video-submit">Get Video</button>
      </div>
    );
  }
}
