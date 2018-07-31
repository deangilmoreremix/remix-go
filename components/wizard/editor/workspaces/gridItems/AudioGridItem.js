import React, { Component } from 'react';

import PropTypes from '../../../../../lib/PropTypes';
import AudioPlayer from '../../../../common/AudioPlayer';

export default class AudioGridItem extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    artwork: PropTypes.string,
    onUse: PropTypes.func.isRequired,
  };

  state = {
    isPlaying: false,
  };

  onAudioPreview = (playingState) => {
    this.setState({
      isPlaying: !playingState,
    });
  };
  
  render() {
    const { onUse, artwork, title, url } = this.props;

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
