import React, { Component } from 'react';

import PropTypes from '../../../../../lib/PropTypes';
import AudioPlayer from '../../../../common/AudioPlayer';

export default class AudioGridItem extends Component {
  static currentPlaying = null;

  static propTypes = {
    item: PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string.isRequired,
      artwork: PropTypes.string,
    }),
    onUse: PropTypes.func.isRequired,
  };

  state = {
    isPlaying: false,
  };

  onAudioPreview = (playingState) => {
    if (!playingState) {
      // Starting to play, stop any current
      if (AudioGridItem.currentPlaying && AudioGridItem.currentPlaying !== this) {
        AudioGridItem.currentPlaying.setState({ isPlaying: false });
      }
      AudioGridItem.currentPlaying = this;
    } else {
      // Stopping
      AudioGridItem.currentPlaying = null;
    }

    this.setState({
      isPlaying: !playingState,
    });
  };

  render() {
    const { item: { artwork, url, title }, onUse } = this.props;

    return (
      <div className="card" style={{ backgroundImage: `url(${artwork || '/static/images/editor/default-artwork.png'})` }}>
        <div className="overlay">
          <div className="buttons-container preview">
            <AudioPlayer
              url={url}
              isPlaying={this.state.isPlaying}
              onAudioPreview={this.onAudioPreview}
            />
            <p>{title}</p>
            <a className="button button-primary btn-use" onClick={() => onUse(url)}>use</a>
          </div>
        </div>
      </div>
    );
  }
}
