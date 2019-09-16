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
export default class GridItem extends Component {
  static propTypes = {
    onRename: PropTypes.func.isRequired,
    onUse: PropTypes.func.isRequired,
    kind: PropTypes.string.isRequired,
    allowEdit: PropTypes.bool.isRequired,
    onPreview: PropTypes.func,
    item: PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string.isRequired,
      preview: PropTypes.string.isRequired,
      artwork: PropTypes.string.isRequired,
    }),
  };

  constructor(props) {
    super(props);

    const { item: { title } } = this.props;
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

  onKeyPress = (event) => {
    if (event.which === 13) {
      return this.onUploadRename();
    }
  };

  onUploadRename = async () => {
    const {
      state: { title: newTitle, isLoading },
      props: { onRename, kind, item: { title } },
    } = this;
    if (isLoading) {
      return;
    }
    if (!validateTitle(newTitle)) {
      if (newTitle !== title && required(newTitle)) {
        this.setState({ isLoading: true });
        try {
          const confirmMessage = `Your ${kind} name '${newTitle}' saved successfully.`;
          await onRename(newTitle);
          showInfo(confirmMessage, 'Success');
        } catch (err) {
          this.setState({ title });
          showError(err.message);
        } finally {
          this.setState({ isLoading: false });
        }
      }
    } else {
      showError(`${kind} title cannot be empty.`);
      this.setState({ title });
    }
  };

  handleChange = (e) => {
    this.setState({ title: e.target.value });
  };

  render() {
    const { isNameEdit, isLoading, title } = this.state;
    const { kind, item, onUse, onPreview, allowEdit } = this.props;
    const Element = ElementTypes[kind];
    return (
      <div className="card">
        <Element
          item={item}
          onUse={onUse}
          onPreview={onPreview}
          title={title}
        />
        {allowEdit &&
        <p className="tile-head">
          <input
            type="text"
            className={validateTitle(title) ? 'invalid' : ''}
            onChange={this.handleChange}
            onFocus={this.onFocusInputChange}
            onBlur={this.onEditLeave}
            onKeyPress={this.onKeyPress}
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
        </p>}
      </div>
    );
  }
}
