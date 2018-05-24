import React, { Component, Fragment } from 'react';
import { Progress, Input } from 'reactstrap';

import Project from '../../../../lib/editor/Project';
import PropTypes from '../../../../lib/PropTypes';
import EmbedDataContainer from '../EmbedDataContainer';

export default class SocialCampaign extends Component {
  static propTypes = {
    className: PropTypes.string,
    project: PropTypes.instanceOf(Project).isRequired,
    onCampaignFinished: PropTypes.func,
  };

  state = {};

  render() {
    return (
      <Fragment>
      </Fragment>
    );
  }
}
