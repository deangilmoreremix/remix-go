import React, { Component } from 'react';
import PropTypes from '../../../lib/PropTypes';

export default class Publisher extends Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  state = {
    isEditing: false,
  };

  onValueChange = () => {
    const { titleField, props: { onChange } } = this;
    onChange(titleField.value);
    this.setState({ isEditing: false });
  };

  render() {
    const { className, title } = this.props;
    const { isEditing } = this.state;
    return (
      <div className={className}>
        {isEditing ?
          <input className="title-field" type="text" value={title} ref={(c) => { this.titleField = c; }} /> :
          <span className="title-field">{title}</span>
        }
        {!isEditing ?
          <img
            className="icon"
            onClick={() => this.setState({ isEditing: true })}
            src="/static/images/publisher/edit.svg"
          /> :
          <div className="buttons-container">
            <a className="button button-primary" onClick={() => this.onValueChange()}>save</a>
            <a className="button" onClick={() => this.setState({ isEditing: false })}>cancel</a>
          </div>
        }
      </div>
    );
  }
}
