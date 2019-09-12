import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import PropTypes from '../../../../../lib/PropTypes';
import { showError, showInfo } from '../../../../../services/alertService';
import { required } from '../../../../../lib/validators';
import VideoGridItem from './VideoGridItem';
import AudioGridItem from './AudioGridItem';


const validateTitle = value => required()(value);
const ElementTypes = {
  audio: AudioGridItem,
  video: VideoGridItem,
};

@inject('api')
@observer
export default class GridItemUploads extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    preview: PropTypes.string.isRequired,
    onPreview: PropTypes.func.isRequired,
    onUse: PropTypes.func.isRequired,
    onRename: PropTypes.func.isRequired,
    kind: PropTypes.string.isRequired,
  };

  constructor(props){
    super(props);

    const { title } = this.props;
    this.state = {
      isNameEdit: false,
      isLoading: false,
      title,
    };
  }

  onFocusInputChange = () => {
    this.setState({ isNameEdit: true });
  };

  onEditLeave = () => {
    this.setState({ isNameEdit: false });
    return this.onUploadRename();
  };

  onUploadRename = async () => {
    const {
      state: { title: newTitle, isLoading },
      props: { onRename, title: oldTitle, kind },
    } = this;
    if (isLoading) {
      return;
    }
    if (!validateTitle(newTitle)) {
      if (newTitle !== oldTitle && required(newTitle)) {
        this.setState({ isLoading: true });
        try {
          const confirmMessage = `Your ${kind} name '${newTitle}' saved successfully.`;
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
      showError(`${kind} title cannot be empty.`);
      this.setState({ title: oldTitle });
    }
  };

  handleChange = (e) => {
    this.setState({ title: e.target.value });
  };

  render() {
    const { isNameEdit, isLoading, title } = this.state;
    const { kind } = this.props;
    const Element = ElementTypes[kind];
    return (
      <div className={`${kind === 'video' ? 'card video-item' : 'card'}`}>
        {Element ?
          (<VideoGridItem {...this.props} title={title} />)
          :
          (<AudioGridItem {...this.props} title={title} />)
        }
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
              onClick={this.onUploadRename}
            />
          )
          }
        </p>
      </div>
    );
  }
}
