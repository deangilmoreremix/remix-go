import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import { Container } from 'reactstrap';

import { initStoreAndPreload, initStore } from '../store';
import Header from './Header';
import Footer from './Footer';

class Layout extends Component {
  static async getInitialProps({ query, req }, preloader) {
    const isServer = !!req;
    const store = await initStoreAndPreload(isServer, query, req, preloader);
    return { store };
  }

  constructor(props) {
    super(props);
    this.store = initStore(props.store);
  }

  render() {
    return (
      <Provider store={this.store}>
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
