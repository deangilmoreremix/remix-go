import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import { Container } from 'reactstrap';

import { initStoreAndPreload, initStore } from '../globals/store';
import { initApiAndPreload, initApi } from '../globals/api';

import Header from './Header';
import Footer from './Footer';
import initPopcornJS from "../lib/PopcornProxy";

class Layout extends Component {
  static async getInitialProps({ query, req }, preloader) {
    const isServer = !!req;
    const store = await initStoreAndPreload(isServer, query, req, preloader);
    const api = await initApiAndPreload(isServer, query, req, preloader);
    return { store, api };
  }

  constructor(props) {
    super(props);
    this.store = initStore(props.store);
    this.api = initApi(props.api);
  }

  render() {
    initPopcornJS(window);
    return (
      <Provider store={this.store} api={this.api}>
        <div>
          <Header />
          <Container {...this.props} className="main">
            {this.props.children}
          </Container>
          <Footer />
        </div>
      </Provider>
    );
  }
}

export default Layout;
