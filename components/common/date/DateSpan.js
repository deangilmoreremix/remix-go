import React, {Component} from 'react';
import moment from 'moment';

export default class DateSpan extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <span className={this.props.className}>
        {moment(this.props.timestamp).format(this.props.format)}
      </span>
    )
  }
}