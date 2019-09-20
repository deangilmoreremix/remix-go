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
    value: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    const { value } = this.props;
    this.state = {
      isNameEdit: false,
      isLoading: false,
      value,
    };
  }

  onFocusInputChange = () => {
    this.setState({ isNameEdit: true });
  };

  onEditLeave = () => {
    this.setState({ isNameEdit: false });
    return this.onUpdate();
  };

  onKeyPress = (event) => {
    if (event.which === 13) {
      return this.onUpdate();
    }
  };

  onUpdate = async () => {
    const {
      state: { value: newValue, isLoading },
      props: { onRename, value: oldValue },
    } = this;
    if (isLoading) {
      return;
    }
    if (!validateTitle(newValue)) {
      if (newValue !== oldValue) {
        this.setState({ isLoading: true });
        try {
          const confirmMessage = `The new name '${newValue}' saved successfully.`;
          await onRename(newValue);
          showInfo(confirmMessage, 'Success');
        } catch (err) {
          this.setState({ value: oldValue });
          showError(err.message);
        } finally {
          this.setState({ isLoading: false });
        }
      }
    } else {
      showError('This field cannot be empty.');
      this.setState({ value: oldValue });
    }
  };

  handleChange = (e) => {
    this.setState({ value: e.target.value });
  };

  render() {
    const { isNameEdit, isLoading, value } = this.state;
    return (
        <p className="tile-head">
          <input
            type="text"
            className={validateTitle(value) ? 'invalid' : ''}
            onChange={this.handleChange}
            onFocus={this.onFocusInputChange}
            onBlur={this.onEditLeave}
            onKeyPress={this.onKeyPress}
            value={value}
          />
          {(isNameEdit || isLoading)
          && (
            <button
              className={`rename-button fa ${isLoading ? 'fa-spinner fa-spin' : 'fa-check'}`}
              onClick={this.onUpdate}
            />
          )
          }
        </p>
    );
  }
}
