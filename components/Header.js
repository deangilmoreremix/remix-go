import React, { Component } from 'react';
import { inject, observer } from 'mobx-react/index';
import { Container } from 'reactstrap';

import Menu from './Menu';
import PropTypes from "../lib/PropTypes";

@inject('store')
@observer
export default class Header extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  render() {
    const { className } = this.props;
    return (
        <header className={`header ${className}`}>
          <Menu />
        </header>
    );
  }
}
