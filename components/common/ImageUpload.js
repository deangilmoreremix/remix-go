import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, FormGroup } from 'reactstrap';

import PropTypes from '../../lib/PropTypes';

@observer
export default class PopcornEditor extends Component {
  static propTypes = {
    onFileUploaded: PropTypes.func.isRequired,
  };

  render() {
    return (
      <Form className="image-upload" onSubmit={() => console.log('form submitted.')}>
        <FormGroup>
          <label>Set Image URL</label>
          <input type="text" />
        </FormGroup>
        <FormGroup>
          <label>or upload file directly from your computer</label>
          <input type="file" />
        </FormGroup>
        <button className="go-button submit-button">Upload</button>
      </Form>
    );
  }
}
