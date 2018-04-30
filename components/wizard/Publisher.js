import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';

@inject('store')
@observer
export default class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return <div>this is a publisher</div>;
  }
}
