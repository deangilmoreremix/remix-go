import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { Input, Progress, Alert } from 'reactstrap';
import DropZone from 'react-dropzone';
import DurationRange from 'react-input-range';

import Waiter from './Waiter';
import PropTypes from '../../lib/PropTypes';
import MediaTypeDetector from '../../lib/popcorn/util/mediaTypeDetector';

@inject('api')
@inject('store')
@observer
export default class VideoUpload extends Component {
  static propTypes = {
    onVideoUploaded: PropTypes.func.isRequired,
  };

  state = {
    url: '',
    isUploading: false,
    uploadPercentage: 0,
    error: null,
    waiter: null,
    trim: {
      min: 0,
      max: 12,
    },
    videoMeta: null,
  };

  handleFileDrop = async (file) => {
    const { store: { common: { video: videoConfig } } } = this.props;
    if (videoConfig.maxSize < file.size) {
      return this.setState({ error: 'We\'re sorry, upload video size can\'t be more than 100MB.' });
    }
    const videoMeta = await new MediaTypeDetector().getMetadata(file.preview, 'video/*');
    if (videoMeta.duration > videoConfig.maxDuration) {
      return this.setState({ error: 'We\'re sorry, upload video can\'t be longer than 60 seconds.' });
    }
    const { onVideoUploaded, api } = this.props;
    this.setState({ isUploading: true });
    try {
      const response = await api.uploadMedia(
        file,
        progress => this.setState({ uploadPercentage: progress }),
      );
      this.setState({
        uploadPercentage: 0,
        isUploading: false,
        error: null,
      });
      onVideoUploaded(response.url);
    } catch (err) {
      this.setState({
        uploadPercentage: 0,
        isUploading: false,
        error: err.message,
      });
    }
  };

  retrieveVideoFromUrl = async () => {
    this.setState({ uploadPercentage: 1, isUploading: true });
    const { store: { common: { video: videoConfig } }, onVideoUploaded } = this.props;
    const { url } = this.state;
    try {
      this.setState({
        uploadPercentage: 0,
        isUploading: false,
        error: null,
      });
      this.setState({ waiter: { message: 'Retrieving video metadata...' } });
      const videoMeta = await new MediaTypeDetector().getMetadata(url);
      if (videoMeta.duration > videoConfig.maxDuration) {
        return this.setState({
          waiter: null,
          error: 'We\'re sorry, upload video can\'t be longer than 60 seconds.',
        });
      }
      onVideoUploaded(videoMeta.source);
      this.setState({ waiter: null });
    } catch (err) {
      this.setState({
        uploadPercentage: 0,
        isUploading: false,
        error: err.message,
      });
    }
  };

  render() {
    const { url, isUploading, error, uploadPercentage, waiter } = this.state;
    return (
      <Fragment>
        { waiter ? <Waiter message={waiter.message} /> : null }
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
          <div className="video-duration-range">
            <DurationRange
              classNames={{
                activeTrack: 'input-range__track input-range__track--active video-range-track',
                disabledInputRange: 'input-range--disabled',
                inputRange: 'input-range',
                labelContainer: 'input-range__label-container',
                slider: 'input-range__slider video-range-slider',
                sliderContainer: 'input-range__slider-container',
                track: 'input-range__track input-range__track--background',
                valueLabel: 'input-range__label input-range__label--value',
                maxLabel: 'hidden',
                minLabel: 'hidden',
              }}
              minValue={0}
              maxValue={60}
              value={this.state.trim}
              onChange={value => this.setState({ trim: value })}
            />
          </div>
          <div className="external-video-submit-container">
            <button
              className={`go-button external-video-submit${isUploading ? ' hidden' : ''}`}
              onClick={() => this.retrieveVideoFromUrl()}
            >Get Video
            </button>
          </div>
          <Alert className="alert-error" color="danger" isOpen={error} toggle={() => this.setState({ error: null })}>
            {error}
          </Alert>
        </div>
      </Fragment>
    );
  }
}
