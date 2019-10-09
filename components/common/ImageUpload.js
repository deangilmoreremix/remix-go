import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { FormGroup, Alert } from 'reactstrap';

import InfiniteLoading from './InfiniteLoading';
import PropTypes from '../../lib/PropTypes';
import MediaTypeDetector from '../../lib/popcorn/util/mediaTypeDetector';
import { openCrop } from '../../lib/utils/open-cropper';

@inject('api')
@observer
export default class ImageUpload extends Component {
  static propTypes = {
    onFileUploaded: PropTypes.func.isRequired,
    onValidate: PropTypes.func,
    isModal: PropTypes.bool,
    recommendedResolution: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }),
  };

  constructor(props) {
    super(props);
    const { recommendedResolution } = props;
    this.recommendedResolutionPrompt = recommendedResolution
      && `${recommendedResolution.width}x${recommendedResolution.height}`;
    this.MediaTypeDetector = new MediaTypeDetector();
  }

  state = {
    error: null,
    file: null,
    url: null,
    isUploading: false,
  };

  changeImage = (event) => {
    const { onValidate } = this.props;
    if (typeof onValidate === 'function') {
      const error = onValidate(event.target.files[0]);
      if (error) {
        return this.setState({ error });
      }
    }
    return this.setState({ file: event.target.files[0], url: null });
  };

  changeUrl = event => this.setState({ url: event.target.value, file: null });

  onFileUploaded = (imageMeta) => {
    const { onFileUploaded } = this.props;
    if (imageMeta.type === 'HTML5' && imageMeta.contentType.indexOf('image/') === 0) {
      onFileUploaded(imageMeta.source);
    } else {
      this.setState({
        error: 'This image format is not supported.',
      });
    }
  };

  uploadFile = async () => {
    const { file, url } = this.state;
    const { api, recommendedResolution, isModal } = this.props;
    if (!file && !url) {
      return;
    }
    this.setState({ isUploading: true });
    try {
      const media = await api.uploadMedia({ data: file || url });
      const imageMeta = await new MediaTypeDetector().getMetadata(media.url);
      openCrop({
        imageMeta,
        recommendedResolution,
        onFileUploaded: this.onFileUploaded,
        isNewModal: !isModal,
      });
    } catch (err) {
      this.setState({
        error: err.message || 'This image format is not supported.',
      });
    } finally {
      this.setState({
        isUploading: false,
        url: null,
      });
    }
  };

  onToggleError = () => {
    this.setState({ error: null });
  };

  render() {
    const { isUploading, file, url, error } = this.state;
    const { recommendedResolutionPrompt } = this;
    return (
      <div className="image-upload">
        <FormGroup>
          <label htmlFor="image-url">
            Set Image URL
            {recommendedResolutionPrompt
            && (
            <span className="text-resolution">
              {`*Recommended image resolution ${recommendedResolutionPrompt}`}
            </span>
            )}
            <input id="image-url" type="text" onChange={this.changeUrl} />
          </label>
        </FormGroup>
        <FormGroup>
          <label htmlFor="image-uploader">
            or upload file directly from your computer
            <input id="image-uploader" type="file" accept="image/*" onChange={this.changeImage} />
          </label>
        </FormGroup>
        <Alert className="alert-error" color="danger" isOpen={!!error} toggle={this.onToggleError}>
          {error}
        </Alert>
        {isUploading
          ? <InfiniteLoading />
          : (
            <button
              className={`go-button submit-button ${file || url ? '' : 'inactive'}`}
              onClick={this.uploadFile}
            >
              Upload
            </button>
          )}
      </div>
    );
  }
}
