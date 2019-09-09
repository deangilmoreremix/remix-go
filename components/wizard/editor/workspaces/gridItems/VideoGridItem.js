import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from '../../../../../lib/PropTypes';

import { showError, showInfo } from '../../../../../services/alertService';
import { required } from '../../../../../lib/validators';

const validateTitle = value => required()(value);

@inject('store')
@observer
export default class VideoGridItem extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    preview: PropTypes.string.isRequired,
    onPreview: PropTypes.func.isRequired,
    onUse: PropTypes.func.isRequired,
  };

  constructor(props){
    super(props);

    const { title } = this.props;
    this.state = {
      isNameEdit: false,
      title,
    };
  }

  togglePreview = (state) => {
    if (this.previewContainer.parentNode.querySelector('video')) {
      this.previewContainer.parentNode.querySelector('video')[state ? 'play' : 'pause']();
    }
  };

  onEditLeave = () => {
    this.setState({ isNameEdit: false });
    return this.onVideoRename();
  };

  onVideoRename = async () => {
    const {
      state: { title: newTitle, isLoading },
      props: { onRename, title: oldTitle },
    } = this;
    if (isLoading) {
      return;
    }
    if (!validateTitle(newTitle)) {
      console.log(newTitle)
      if (newTitle !== oldTitle && required(newTitle)) {
        this.setState({ isLoading: true });
        try {
          const confirmMessage = `Your project name '${newTitle}' saved successfully.`;
          await onRename(newTitle);
          showInfo(confirmMessage, 'Success');
        } catch (err) {
          this.setState({ title: oldTitle });
          showError(err.message);
        } finally {
          this.setState({ isLoading: false });
        }
      }
    } else {
      showError('Project title cannot be empty.');
      this.setState({ title: oldTitle });
    }
};

  handleChange = (e) => {
    console.log(e.target.value)
    this.setState({ title: e.target.value });
  };

  render() {
    const { onPreview, onUse, url, preview } = this.props;
    const { isNameEdit, isLoading, title } = this.state;
    return (
      <div className="card video-item">
      <div className="card video-item" style={{ backgroundImage: `url(${preview ? '' : '/static/images/editor/default-video-preview.png'})` }}>
        {preview &&
          <video
            className="video"
            preload="true"
            ref={(c) => { this.previewContainer = c; }}
            loop
            muted
          >
            <source src={preview} type="video/webm" />
          </video>
        }
        <div
          className="overlay"
          onMouseOver={() => this.togglePreview(true)}
          onMouseOut={() => this.togglePreview(false)}
        >
          <div
            className="buttons-container"
            onMouseOver={() => this.togglePreview(true)}
          >
            <a className="button btn-preview" onClick={() => { onPreview(title, url); }}>
              <i className="fa fa-play" />
            </a>
            <p className="title">{title}</p>
            <a className="button button-primary" onClick={() => onUse(url)}>use</a>
          </div>
        </div>
      </div>
        <p className="sdsd">
          <input
            type="text"
            className="sdd"
            onChange={this.handleChange}
            onFocus={() => this.setState({ isNameEdit: true })}
            onBlur={this.onEditLeave}
            value={title}
          />
          {(isNameEdit || isLoading)
          && (
            <button
              className={`rename-button fa ${isLoading ? 'fa-spinner fa-spin' : 'fa-check'}`}
              onClick={this.onVideoRename}
            />
          )
          }
        </p>
    </div>
    );
  }
}
