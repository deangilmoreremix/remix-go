import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { Col, Row, Button, FormGroup, Input } from 'reactstrap';
import classnames from 'classnames';
import CopyToClipboard from 'react-copy-to-clipboard';

import QRCode from 'qrcode.react';
import Router from "next/router";

@inject('store')
@observer
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <Fragment>
      </Fragment>
    );
  }
}
