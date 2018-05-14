import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { FormGroup } from 'reactstrap';

import InfiniteLoading from '../common/InfiniteLoading';
import PropTypes from '../../lib/PropTypes';

@inject('api')
@observer
export default class PopcornEditor extends Component {
  static propTypes = {
    onFileUploaded: PropTypes.func.isRequired,
  };

  state = {
    file: null,
    url: null,
    isUploading: false,
  };

  render() {
    const { onFileUploaded, api } = this.props;
    const { isUploading, file, url } = this.state;
    return (
      <div className="image-upload">
        <FormGroup>
          <label>Set Image URL</label>
          <input type="text" onChange={event => this.setState({ url: event.target.value, file: null })} />
        </FormGroup>
        <FormGroup>
          <label>or upload file directly from your computer</label>
          <input type="file" onChange={event => this.setState({ file: event.target.files[0], url: null })} />
        </FormGroup>
        {isUploading ?
          <InfiniteLoading /> :
          <button
            className="go-button submit-button"
            onClick={async () => {
              this.setState({ isUploading: true });
              const response = await api.uploadImage(file || url);
              onFileUploaded(response.url);
              this.setState({
                isUploading: false,
                file: null,
                url: null,
              });
            }}
          >Upload
          </button>}
      </div>
    );
  }
}
