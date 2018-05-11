import React, { Component } from 'react';
import { observer } from 'mobx-react';

import PropTypes from '../../PropTypes';

@observer
export default class PopcornEditor extends Component {
  static propTypes = {
    trackEvent: PropTypes.any,
    onTrackEventUpdate: PropTypes.func.isRequired,
  };

  updateTrackEvent(key, value) {
    const { trackEvent, onTrackEventUpdate } = this.props;
    trackEvent[key] = value;
    onTrackEventUpdate(trackEvent);
  }
}
