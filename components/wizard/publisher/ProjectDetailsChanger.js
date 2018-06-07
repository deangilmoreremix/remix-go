import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Input, FormGroup } from 'reactstrap';

import Project from '../../../lib/editor/Project';
import PropTypes from '../../../lib/PropTypes';

@inject('api')
@observer
export default class ProjectDetailsChanger extends Component {
  static propTypes = {
    className: PropTypes.string,
    project: PropTypes.instanceOf(Project).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const { project: { make: { title, description, thumbnail } } } = props;
    this.state = { title, description, thumbnail };
  }

  state = {
    title: null,
    description: null,
    thumbnail: null,
  };

  onValueChange = () => {
    const { onChange, project } = this.props;
    const { title, description, thumbnail } = this.state;
    project.make.title = title;
    project.make.description = description;
    project.make.thumbnail = thumbnail;
    onChange(project);
  };

  render() {
    const { api, className } = this.props;
    const { title, description, thumbnail } = this.state;
    return (
      <div className={className}>
        <input
          className="title-field"
          type="text"
          value={title}
          onChange={({ target: { value } }) => this.setState({ title: value })}
        />
        <Input
          type="textarea"
          rows={4}
          value={description}
          onChange={({ target: { value } }) => this.setState({ description: value })}
        />
        <img src={thumbnail} alt="Project Posterframe" />
        <FormGroup>
          <label>Set Image URL</label>
          <input
            type="text"
            onChange={({ target: { value } }) => this.setState({ thumbnail: value })}
          />
        </FormGroup>
        <FormGroup>
          <label>or upload file directly from your computer</label>
          <input
            type="file"
            onChange={async ({ target: { files: [file] } }) => {
              const response = await api.uploadMedia(file);
              this.setState({ thumbnail: response.url });
            }}
          />
        </FormGroup>
        <a className="button button-primary" onClick={() => this.onValueChange()}>save</a>
      </div>
    );
  }
}
