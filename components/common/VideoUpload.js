import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { Input, Progress, Alert } from 'reactstrap';
import DropZone from 'react-dropzone';
import DurationRange from 'react-input-range';

import Waiter from './Waiter';
import PropTypes from '../../lib/PropTypes';
import MediaTypeDetector from '../../lib/popcorn/util/mediaTypeDetector';

const supportedMimeTypes = ['video/mp4', 'video/webm'];

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
      max: 0,
    },
    videoMeta: null,
  };

  handleFileDrop = async (file) => {
    const { store: { common: { video: videoConfig } } } = this.props;
    if (videoConfig.maxSize < file.size) {
      return this.setState({ error: 'We\'re sorry, upload video size can\'t be more than 100MB.' });
    }
    const videoMeta = await new MediaTypeDetector().getMetadata(file.preview, 'video/*');
    const { api } = this.props;
    this.setState({ isUploading: true, error: null });
    try {
      const response = await api.uploadMedia(
        { data: file, preview: true },
        progress => this.setState({ uploadPercentage: progress }),
      );
      await api.storeAsset(response.url, response.preview, api.constructor.ASSET_TYPES.VIDEOS);
      videoMeta.source = [response.hls, response.url].join('|');
      this.setState({
        uploadPercentage: 0,
        isUploading: false,
        error: null,
        videoMeta,
        trim: {
          min: 0,
          max: Math.min(videoMeta.duration, videoConfig.maxDuration),
        },
      });
    } catch (err) {
      this.setState({
        uploadPercentage: 0,
        isUploading: false,
        error: err.message,
      });
    }
  };

  submitVideo = async () => {
    const { onVideoUploaded } = this.props;
    const { videoMeta, trim } = this.state;
    onVideoUploaded(videoMeta.source, trim);
  };

  retrieveVideoFromUrl = async () => {
    this.setState({ uploadPercentage: 1, isUploading: true, error: null });
    const { store: { common: { video: videoConfig } } } = this.props;
    const { url } = this.state;
    try {
      this.setState({
        uploadPercentage: 0,
        isUploading: false,
        error: null,
      });
      this.setState({ waiter: { message: '' } });

      const videoMeta = await new MediaTypeDetector().getMetadata(url);
      if (videoMeta.type === 'HTML5' && supportedMimeTypes.indexOf(videoMeta.contentType) === -1) {
        return this.setState({
          waiter: null,
          error: 'This media format is not supported. Please try to upload MP4 or WebM video file.',
        });
      }
      this.setState({
        waiter: null,
        videoMeta,
        trim: {
          min: 0,
          max: Math.min(videoMeta.duration, videoConfig.maxDuration),
        },
      });
    } catch (err) {
      this.setState({
        waiter: null,
        uploadPercentage: 0,
        isUploading: false,
        error: (err && err.message)
          || 'This media format is not supported. Please try to upload MP4 or WebM video file.',
      });
    }
  };

  render() {
    const { store: { common: { video: videoConfig } } } = this.props;
    const { url, isUploading, error, uploadPercentage, videoMeta, waiter } = this.state;

    return (
      <Fragment>
        {waiter ? <Waiter message={waiter.message} /> : null}
        <div className="video-upload-container">
          {videoMeta
            ? (
              <div className="video-range-container">
                <label htmlFor="duration-range">
                  {`Trim your video (selected duration can't be longer than ${videoConfig.maxDuration} seconds)`}
                </label>
                <DurationRange
                  id="duration-range"
                  classNames={{
                    activeTrack: 'input-range__track input-range__track--active video-range-track',
                    disabledInputRange: 'input-range--disabled',
                    inputRange: 'input-range video-range',
                    labelContainer: 'input-range__label-container',
                    slider: 'input-range__slider video-range-slider',
                    sliderContainer: 'input-range__slider-container',
                    track: 'input-range__track input-range__track--background video-range-track-background',
                    valueLabel: 'input-range__label input-range__label--value',
                    maxLabel: 'hidden',
                    minLabel: 'hidden',
                  }}
                  formatLabel={value => `${value.toFixed(2)}s`}
                  minValue={0}
                  maxValue={videoMeta ? videoMeta.duration : 0}
                  value={this.state.trim}
                  step={0.01}
                  onChange={(value) => {
                    if (value.max - value.min > videoConfig.maxDuration) {
                      return;
                    }
                    this.setState({ trim: value });
                  }}
                />
              </div>
            )
            : (
              <div className="video-upload-box">
                <DropZone
                  className={`upload-dropzone${isUploading ? ' hidden' : ''}`}
                  activeClassName="upload-dropzone hot"
                  onDrop={([file], [noFile]) => {
                    if (file) {
                      return this.handleFileDrop(file);
                    } else if (noFile) {
                      return this.setState({ error: 'This media format is not supported. Please try to upload MP4 or WebM video file.' });
                    }
                  }}
                  accept={supportedMimeTypes}
                >
                  <div className="dropzone-inner">
                    <img className="icon" src="../../static/images/upload.png" alt="Video upload" />
                    <h5 className="label">
                    Click or drag your file here to start uploading it.
                      <br />
                    Maximum file size: 100mb.  Format: mp4/WebM.
                      <br />
                    After upload you we be prompted to select up to 60 seconds
                      <br />
                    for use in your project.
                      <br />
                    </h5>
                  </div>
                </DropZone>
                <div className={`upload-progress${!isUploading ? ' hidden' : ''}`}>
                  <h5 className="label">
                    {uploadPercentage < 1 ? `${(uploadPercentage * 100).toFixed(0)}%` : 'Processing your media...'}
                  </h5>
                  <Progress
                    animated
                    className="upload-progress-bar"
                    value={uploadPercentage * 100}
                  />
                </div>
                <h5 className={isUploading ? ' hidden' : ''}>
                or use link to external video hosting (YouTube, Vimeo,
                etc)
                </h5>
                <Input
                  className={`external-video-link${isUploading ? ' hidden' : ''}`}
                  type="text"
                  value={url}
                  onChange={({ target: { value } }) => this.setState({ url: value })}
                />
                <Alert className="alert-error" color="danger" isOpen={!!error} toggle={() => this.setState({ error: null })}>
                  {error}
                </Alert>
              </div>
            )}
          <div className="external-video-submit-container">
            <button
              className={`go-button back-button${videoMeta ? '' : ' hidden'}`}
              onClick={() => this.setState({ url: '', videoMeta: null })}
            >
              <span className="fa fa-caret-left" />
              Upload Video
            </button>
            <button
              className={`go-button external-video-submit${isUploading ? ' hidden' : ''}${(url.length > 0 || videoMeta) ? '' : ' inactive'}`}
              onClick={() => (videoMeta ? this.submitVideo() : this.retrieveVideoFromUrl())}
            >
              {videoMeta ? 'Continue' : 'Retrieve video data'}
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}
