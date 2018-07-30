import React, { Component } from 'react';
import PropTypes from '../../lib/PropTypes';

export default class AudioPlayer extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    onAudioPreview: PropTypes.func.isRequired,
    isPlaying: PropTypes.bool.isRequired,
  };

  audio = new Audio();

  playAudio = () => {
    this.audio.play();
  }

  pauseAudio = () => {
    this.audio.pause();
  }

  render() {
    const { url, isPlaying, onAudioPreview } = this.props;

    if (isPlaying) {
      if (!this.audio.src) {
        this.audio.src = url;
        this.audio.preplay = true;
      }
      this.playAudio();
    } else {
      this.pauseAudio();
    }
    return (
      <a className="button btn-preview" onClick={() => {onAudioPreview(isPlaying)}}>
        <i className={`fa fa-${isPlaying ? 'pause' : 'play'}`} />
      </a>
    );
  }
}
