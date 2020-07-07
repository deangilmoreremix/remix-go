import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Input, FormGroup } from 'reactstrap';
import { PopupboxManager } from 'react-popupbox';

import Project from '../../../lib/editor/Project';
import PropTypes from '../../../lib/PropTypes';
import ImageUpload from '../../common/ImageUpload';

const recommendedResolution = {
  width: 1200,
  height: 630,
};

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

  isDataValid = () => {
    const { title } = this.state;
    return title && title.length > 0;
  };

  onFileUploaded = (thumbnail) => {
    this.setState({ thumbnail });
    PopupboxManager.close();
  };

  render() {
    const { className } = this.props;
    const { title, description, thumbnail } = this.state;
    return (
      <div className={className}>
        <FormGroup>
          <label htmlFor="project-details-description">Project Title</label>
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
            className="overview-item description-field overview-item-post-description"
            type="textarea"
            rows={3}
            value={description}
            onChange={({ target: { value } }) => this.setState({ description: value })}
          />
        </FormGroup>
        <FormGroup className="thumbnail-field">
          <label htmlFor="project-details-thumbnail">Project Thumbnail</label>
          <img
            id="project-details-thumbnail"
            src={thumbnail}
            alt="Project Posterframe"
          />
          <div className="upload-box">

            <ImageUpload
              onFileUploaded={this.onFileUploaded}
              recommendedResolution={recommendedResolution}
            />
            <button
              className={`go-button button-primary submit ${this.isDataValid() ? '' : 'inactive'}`}
              onClick={() => {
                if (this.isDataValid()) {
                  this.onValueChange();
                }
              }}
            >
              save
            </button>
          </div>
        </FormGroup>
      </div>
    );
  }
}
