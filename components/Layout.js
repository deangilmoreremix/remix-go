import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import { Container } from 'reactstrap';

import { initStoreAndPreload, initStore } from '../globals/store';
import { initApiAndPreload, initApi } from '../globals/templateApi';

import Header from './Header';
import Footer from './Footer';

class Layout extends Component {
  static async getInitialProps({ query, req }, preloader) {
    const isServer = !!req;
    const store = await initStoreAndPreload(isServer, query, req, preloader);
    const templateApi = await initApiAndPreload(isServer, query, req, preloader);
    return { store, templateApi };
  }

  constructor(props) {
    super(props);
    this.store = initStore(props.store);
    this.templateApi = initApi(props.templateApi);
  }

  render() {
    return (
      <Provider store={this.store} templateApi={this.templateApi}>
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
