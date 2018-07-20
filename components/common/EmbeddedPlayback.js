import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from '../../lib/PropTypes';
import Project from '../../lib/editor/Project';

const POSTMESSAGE_URL = 'https://cdn.vidcloud.io/v/playback_preview';

@observer
export default class EmbeddedPlayback extends Component {
  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    source: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Project),
    ]).isRequired,
    title: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
  };

  preplayHandler(event) {
    const { source } = this.props;
    const { source: frameConductor, data: { topic } } = event;
    if (topic !== 'preplay') {
      return;
    }

    frameConductor.postMessage({
      topic: 'preplay',
      config: {
        domain: 'vidcloud.io',
        serviceName: 'VidCloud',
        salesPage: '',
        privacyPolicyLink: '',
        hideSalesPage: true,
        hidePlaybackLogo: true,
        hideCopyButton: true,
        showExtendedEndroll: false,
        showShare: false,
        allowFacebook: false,
        thumbnail: source.thumbnail,
        data: JSON.stringify(source.popcornObject),
      },
    }, POSTMESSAGE_URL);
  }

  render() {
    const { title, source, width, height, className } = this.props;
    if (source instanceof Project) {
      if (process.browser) {
        window.addEventListener('message', event => this.preplayHandler(event));
      }
    }
    return (<iframe
      className={className}
      title={title}
      src={source instanceof Project ? POSTMESSAGE_URL : source}
      width={width}
      height={height}
      frameBorder="0"
      mozallowfullscreen="true"
      webkitallowfullscreen="true"
      allowFullScreen
    />);
  }
}

