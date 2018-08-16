import React, { Component } from 'react';
import PropTypes from '../../lib/PropTypes';

export default class AudioPlayer extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    onAudioPreview: PropTypes.func.isRequired,
    isPlaying: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.audio = new Audio();
    this.audio.preplay = true;
  }

  componentWillUnmount() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  playAudio = (url) => {
    if (!this.audio.src) {
      this.audio.src = url;
    }
    this.audio.play();
  }

  pauseAudio = () => {
    this.audio.pause();
  }

  render() {
    const { url, isPlaying, onAudioPreview } = this.props;
    if (isPlaying) {
      this.playAudio(url);
    } else {
      this.pauseAudio();
    }
    return (
      <a className={`button btn-preview ${isPlaying ? `playing` : ''}`} onClick={() => {onAudioPreview(isPlaying)}}>
        <i className={`fa fa-${isPlaying ? 'pause' : 'play'}`} />
      </a>
    );
  }
}
