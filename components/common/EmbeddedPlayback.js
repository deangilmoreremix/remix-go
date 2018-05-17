import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from '../../lib/PropTypes';

@observer
export default class EmbeddedPlayback extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
  };

  render() {
    const { title, url, width, height } = this.props;
    return (<iframe
      title={title}
      src={url}
      width={width}
      height={height}
      frameBorder="0"
      mozallowfullscreen="true"
      webkitallowfullscreen="true"
      allowFullScreen
    />);
  }
}

