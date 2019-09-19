import React, { Component } from 'react';
import { observer } from 'mobx-react';

import PropTypes from '../../../../../lib/PropTypes';
import { showError, showInfo } from '../../../../../services/alertService';
import { required } from '../../../../../lib/validators';


const validateTitle = value => required()(value);

@observer
export default class InputField extends Component {
  static propTypes = {
    onRename: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
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
    return this.onRename();
  };

  onKeyPress = (event) => {
    if (event.which === 13) {
      return this.onRename();
    }
  };

  onRename = async () => {
    const {
      state: { title: newTitle, isLoading },
      props: { onRename, title: oldTitle },
    } = this;
    if (isLoading) {
      return;
    }
    if (!validateTitle(newTitle)) {
      if (newTitle !== oldTitle) {
        this.setState({ isLoading: true });
        try {
          const confirmMessage = `The new title '${newTitle}' saved successfully.`;
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
      showError('The title cannot be empty.');
      this.setState({ title: oldTitle });
    }
  };

  handleChange = (e) => {
    this.setState({ title: e.target.value });
  };

  render() {
    const { isNameEdit, isLoading, title } = this.state;
    return (
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
              onClick={this.onRename}
            />
          )
          }
        </p>
    );
  }
}
