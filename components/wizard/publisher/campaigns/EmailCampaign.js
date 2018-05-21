import React, { Component, Fragment } from 'react';
import PropTypes from '../../../../lib/PropTypes';

export default class EmailCampaign extends Component {
  static propTypes = {
    className: PropTypes.string,
    project: PropTypes.string.isRequired,
  };

  state = {
  };

  render() {
    const { className } = this.props;
    return (
      <Fragment>
        <div className={className}>

        </div>
      </Fragment>
    );
  }
}
