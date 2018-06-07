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

    const { project: { name: title, description, thumbnail } } = props;
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
    project.name = title;
    project.description = description;
    project.thumbnail = thumbnail;
    onChange(project);
  };

  render() {
    const { api, className } = this.props;
    const { title, description, thumbnail } = this.state;
    return (
      <div className={className}>
        <FormGroup>
          <label htmlFor="project-details-description">Project Description</label>
          <Input
            id="project-details-title"
            className="overview-item title-field"
            type="text"
            value={title}
            onChange={({ target: { value } }) => this.setState({ title: value })}
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="project-details-description">Project Description</label>
          <Input
            id="project-details-description"
            className="overview-item description-field"
            type="textarea"
            rows={4}
            value={description}
            onChange={({ target: { value } }) => this.setState({ description: value })}
          />
        </FormGroup>
        <FormGroup className="thumbnail-field">
          <label htmlFor="project-details-thumbnail">Project thumbnail</label>
          <img id="project-details-thumbnail" src={thumbnail} alt="Project Posterframe" />
          <div className="upload-box">
            <label>Set Image URL</label>
            <Input
              className="overview-item link-input"
              type="text"
              onChange={({ target: { value } }) => this.setState({ thumbnail: value })}
            />
            <label>or upload file directly from your computer</label>
            <Input
              type="file"
              onChange={async ({ target: { files: [file] } }) => {
                const response = await api.uploadMedia(file);
                this.setState({ thumbnail: response.url });
              }}
            />
          </div>
        </FormGroup>
        <a className="button button-primary submit" onClick={() => this.onValueChange()}>save</a>
      </div>
    );
  }
}
