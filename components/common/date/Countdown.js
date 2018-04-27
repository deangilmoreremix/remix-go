import React, { Component } from 'react';

export default class Countdown extends Component {
  constructor(props) {
    super(props);
    this.state = { countdown: props.deadline - Date.now() };
  }

  componentDidMount() {
    clearInterval(this.timer);
    this.timer = setInterval(this.tick.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick() {
    const { deadline } = this.props;
    let countdown = deadline - Date.now();
    if (countdown < 0) {
      clearInterval(this.timer);
      countdown = 0;
    }
    const days = Math.floor(countdown / (1000 * 60 * 60 * 24));
    const hours = Math.floor((countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countdown % (1000 * 60)) / 1000);
    this.setState({
      countdown,
      formattedCountdown: `${(days < 10 ? '0' : '') + days} : ${(hours < 10 ? '0' : '') + hours} : 
      ${(minutes < 10 ? '0' : '') + minutes} : ${(seconds < 10 ? '0' : '') + seconds}`
    });
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.state.formattedCountdown}
      </div>
    )
  }
}