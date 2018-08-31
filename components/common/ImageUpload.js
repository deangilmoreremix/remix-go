import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { FormGroup, Alert } from 'reactstrap';

import InfiniteLoading from '../common/InfiniteLoading';
import PropTypes from '../../lib/PropTypes';
import MediaTypeDetector from '../../lib/popcorn/util/mediaTypeDetector';

@inject('api')
@observer
export default class ImageUpload extends Component {
  static propTypes = {
    onFileUploaded: PropTypes.func.isRequired,
  };

  state = {
    error: null,
    file: null,
    url: null,
    isUploading: false,
  };

  render() {
    const { onFileUploaded, api } = this.props;
    const { isUploading, file, url, error } = this.state;
    return (
      <div className="image-upload">
        <FormGroup>
          <label>Set Image URL</label>
          <input type="text" onChange={event => this.setState({ url: event.target.value, file: null })} />
        </FormGroup>
        <FormGroup>
          <label>or upload file directly from your computer</label>
          <input type="file" accept="image/*" onChange={event => this.setState({ file: event.target.files[0], url: null })} />
        </FormGroup>
        <Alert className="alert-error" color="danger" isOpen={!!error} toggle={() => this.setState({ error: null })}>
          {error}
        </Alert>
        {isUploading ?
          <InfiniteLoading /> :
          <button
            className="go-button submit-button"
            onClick={async () => {
              this.setState({ isUploading: true });
              try {
                const videoMeta = await new MediaTypeDetector()
                  .getMetadata(file ? (await api.uploadMedia(file)).url : url);
                if (videoMeta.type === 'HTML5' && videoMeta.contentType.indexOf('image/') === 0) {
                  onFileUploaded(videoMeta.source);
                } else {
                  this.setState({
                    error: 'This image format is not supported.',
                  });
                }
              } catch (err) {
                console.log(err);
                this.setState({
                  error: err.message || 'This image format is not supported.',
                });
              }
              finally {
                this.setState({
                  isUploading: false,
                  url: null,
                });
              }
            }}
          >Upload
          </button>}
      </div>
    );
  }
}
