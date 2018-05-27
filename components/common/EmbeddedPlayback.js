import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from '../../lib/PropTypes';
import Project from '../../lib/editor/Project';

const POSTMESSAGE_URL = 'https://dev-cdn.videoremix.io/v/playback_preview';

@observer
export default class EmbeddedPlayback extends Component {
  static propTypes = {
    className: PropTypes.string,
    source: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Project),
    ]).isRequired,
    title: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
  };

  render() {
    const { title, source, width, height, className } = this.props;
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
      ref={(c) => { this.frameConductor = c; }}
      onLoad={() => {
        if (source instanceof Project) {
          setTimeout(() => {
            console.log('sending frame');
            this.frameConductor.contentWindow.postMessage({
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
                data: source.popcornObject,
              },
            }, this.frameConductor.src);
          }, 1000);
        }
      }}
    />);
  }
}

