import React, { Component } from 'react';
import { observer } from 'mobx-react';
import initPopcornJS from '../../../../../lib/PopcornProxy';

import PropTypes from '../../../../../lib/PropTypes';

@observer
export default class ConstructionScene extends Component {
  static propTypes = {
    className: PropTypes.string,
    popcornData: PropTypes.any,
  };

  componentDidMount() {
    const { popcornData } = this.props;
    if (process.browser) {
      const popcorn = window.Popcorn.smart(`#${popcornData.target}`,
        popcornData.mediaUrlsString, popcornData.mediaPopcornOptions);
      popcornData.elements.forEach((element) => {
        popcorn[element.type](element.popcornOptions);
      });
    }
  }

  render() {
    const { className } = this.props;
    return (
      <div id="embed-wrapper" className={`wrapper cf faded embed full-height full-width ${className || ''}`}>
        <div id="video-container" className="construction-container" data-butter="target">
          <div id="video" />
        </div>
      </div>
    );
  }
}
