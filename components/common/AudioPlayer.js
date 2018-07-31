import React, { Component } from 'react';
import PropTypes from '../../lib/PropTypes';

export default class AudioPlayer extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    onAudioPreview: PropTypes.func.isRequired,
    isPlaying: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super();
    this.audio = new Audio();
    this.audio.src = props.url;
    this.audio.preplay = true;
  }

  playAudio = () => {
    this.audio.play();
  }

  pauseAudio = () => {
    this.audio.pause();
  }

  render() {
    const { isPlaying, onAudioPreview } = this.props;

    if (isPlaying) {
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
