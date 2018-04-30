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
  async componentDidMount() {
    await this.fetchData();
  }

  async fetchData() {
    const { store } = this.props;
    const { version } = await store.fetchHealth();
    this.setState({ version });
  }

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
