import React, { Component } from 'react';
import { inject, observer } from 'mobx-react/index';
import { Container } from 'reactstrap';

import Menu from './Menu';

@inject('store')
@observer
export default class Header extends Component {
  state = {
    version: false,
  };

  render() {
    return (
      <Container>
        <header className="header">
          <Menu />
        </header>
      </Container>
    );
  }
}
