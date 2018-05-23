import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Input, Progress } from 'reactstrap';
import DropZone from 'react-dropzone';

import PropTypes from '../../lib/PropTypes';
import MediaTypeDetector from '../../lib/popcorn/util/mediaTypeDetector';

@inject('api')
@observer
export default class VideoUpload extends Component {
  static propTypes = {
    onVideoUploaded: PropTypes.func.isRequired,
  };

  state = {
    url: '',
    isUploading: false,
    uploadPercentage: 0,
  };

  handleFileDrop = async (file) => {
    const { onVideoUploaded, api } = this.props;
    this.setState({ isUploading: true });
    const response = await api.uploadMedia(
      file,
      progress => this.setState({ uploadPercentage: progress }),
    );
    this.setState({ isUploading: false });
    onVideoUploaded(response.url);
  };

  retrieveVideoFromUrl = async () => {
    const { onVideoUploaded } = this.props;
    const { url } = this.state;
    const videoTypeDetector = new MediaTypeDetector();
    this.setState({ uploadPercentage: 1, isUploading: true });
    try {
      onVideoUploaded((await videoTypeDetector.getMetadata(url)).source);
    } catch (err) {
      this.setState({ uploadPercentage: 0, isUploading: false });
      alert(err.message);
    }
  };

  render() {
    const { url, isUploading, uploadPercentage } = this.state;
    return (
      <div className="video-upload-box">
        <DropZone
          className={`upload-dropzone${isUploading ? ' hidden' : ''}`}
          activeClassName="upload-dropzone hot"
          onDrop={([file]) => this.handleFileDrop(file)}
          accept="video/*"
        >
          <div className="dropzone-inner">
            <img className="icon" src="../../static/images/upload.png" alt="Video upload" />
            <h5 className="label">Click or drag your file here to start uploading it</h5>
          </div>
        </DropZone>
        <div className={`upload-progress${!isUploading ? ' hidden' : ''}`}>
          <h5 className="label">{uploadPercentage < 1 ? `${(uploadPercentage * 100).toFixed(0)}%` : 'Processing your media...'}</h5>
          <Progress
            animated
            className="upload-progress-bar"
            value={uploadPercentage * 100}
          />
        </div>
        <h5 className={isUploading ? ' hidden' : ''}>or use link to external video hosting (YouTube, Vimeo, etc)</h5>
        <Input
          className={`external-video-link${isUploading ? ' hidden' : ''}`}
          type="text"
          value={url}
          onChange={({ target: { value } }) => this.setState({ url: value })}
        />
        <button
          className={`go-button external-video-submit${isUploading ? ' hidden' : ''}`}
          onClick={() => this.retrieveVideoFromUrl()}
        >Get Video
        </button>
      </div>
    );
  }
}
