import React, { Component } from 'react';

import PropTypes from '../../../../../lib/PropTypes';
import AudioPlayer from '../../../../common/AudioPlayer';

export default class AudioGridItem extends Component {
  static propTypes = {
    item: PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string.isRequired,
      preview: PropTypes.string.isRequired,
      artwork: PropTypes.string,
    }),
    onUse: PropTypes.func.isRequired,
    title: PropTypes.string,
  };

  state = {
    isPlaying: false,
  };

  onAudioPreview = (playingState) => {
    // TODO: refactor this shit
    const playing = document.getElementsByClassName('playing');
    if (playing && playing.length > 0) {
      for (let i = 0; i < playing.length; i += 1) {
        playing[i].click();
      }
    }

    this.setState({
      isPlaying: !playingState,
    });
  };

  render() {
    const { item: { artwork, url }, onUse, title } = this.props;

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
