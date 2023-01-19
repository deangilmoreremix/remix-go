import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from '../../lib/PropTypes';
import Project from '../../lib/editor/Project';

const POSTMESSAGE_URL = 'https://dev-cdn.vidcloud.io/v/playback_preview';

@observer
export default class EmbeddedPlayback extends Component {
  static propTypes = {
    className: PropTypes.string,
    source: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Project),
    ]).isRequired,
    playerUrl: PropTypes.string,
    title: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
  };

  preplayHandler(event) {
    const { source, playerUrl = POSTMESSAGE_URL } = this.props;
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
        allowedSocials: [],
        thumbnail: source.thumbnail,
        data: JSON.stringify(source.popcornObject),
        title: source.name,
      },
    }, playerUrl);
  }

  render() {
    const { title, source, width, height, className, playerUrl = POSTMESSAGE_URL } = this.props;
    if (source instanceof Project) {
      if (process.browser) {
        window.addEventListener('message', event => this.preplayHandler(event));
      }
    }
    return (<iframe
      className={className}
      title={title}
      src={source instanceof Project ? `${playerUrl}?preplay=postMessage` : source}
      width={width}
      height={height}
      frameBorder="0"
      allow="autoplay; fullscreen"
      mozallowfullscreen="true"
      webkitallowfullscreen="true"
      allowFullScreen
    />);
  }
}

