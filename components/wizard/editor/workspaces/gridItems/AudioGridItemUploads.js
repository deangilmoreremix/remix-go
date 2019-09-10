import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from '../../../../../lib/PropTypes';

import { showError, showInfo } from '../../../../../services/alertService';
import { required } from '../../../../../lib/validators';
import AudioGridItem from './AudioGridItem';

const validateTitle = value => required()(value);

@inject('api')
@observer
export default class AudioGridItemUploads extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    artwork: PropTypes.string,
    onUse: PropTypes.func.isRequired,
    onRename: PropTypes.func.isRequired,
  };

  constructor(props){
    super(props);

    const { title } = this.props;
    this.state = {
      isNameEdit: false,
      title,
    };
  }

  onFocusInputChange = () => {
    this.setState({ isNameEdit: true });
  };

  onEditLeave = () => {
    this.setState({ isNameEdit: false });
    return this.onAudioRename();
  };

  onAudioRename = async () => {
    const {
      state: { title: newTitle, isLoading },
      props: { onRename, title: oldTitle },
    } = this;
    if (isLoading) {
      return;
    }
    if (!validateTitle(newTitle)) {
      if (newTitle !== oldTitle && required(newTitle)) {
        this.setState({ isLoading: true });
        try {
          const confirmMessage = `Your audio name '${newTitle}' saved successfully.`;
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
      showError('Audio title cannot be empty.');
      this.setState({ title: oldTitle });
    }
  };

  handleChange = (e) => {
    this.setState({ title: e.target.value });
  };

  render() {
    const { isNameEdit, isLoading, title } = this.state;
    return (
      <div className="card">
        <AudioGridItem {...this.props} title={title} />
        <p className="tile-head">
          <input
            type="text"
            className={validateTitle(title) ? 'invalid' : ''}
            onChange={this.handleChange}
            onFocus={this.onFocusInputChange}
            onBlur={this.onEditLeave}
            value={title}
          />
          {(isNameEdit || isLoading)
          && (
            <button
              className={`rename-button fa ${isLoading ? 'fa-spinner fa-spin' : 'fa-check'}`}
              onClick={this.onAudioRename}
            />
          )
          }
        </p>
      </div>
    );
  }
}
