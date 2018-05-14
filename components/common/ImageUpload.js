import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { FormGroup } from 'reactstrap';

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
  };

  render() {
    const { onFileUploaded, api } = this.props;
    const { file, url } = this.state;
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
        <button
          className="go-button submit-button"
          onClick={async () => {
            const response = await api.uploadImage(file || url);
            onFileUploaded(response.url);
          }}
        >Upload
        </button>
      </div>
    );
  }
}
