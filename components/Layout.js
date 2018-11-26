import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import { Container } from 'reactstrap';
import Head from 'next/head';

import { initStoreAndPreload, initStore } from '../globals/store';
import { initApiAndPreload, initApi } from '../globals/api';

import PopcornProxy from '../lib/PopcornProxy';
import Header from './Header';
import Footer from './Footer';
import Intercom from './common/Intercom';

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
    if (process.browser) {
      PopcornProxy.init(window);
    }
    return (
      <Provider store={this.store} api={this.api}>
        <div>
          <Head>
            <title>
              {this.store.common.whiteLabel.name} GO
            </title>
          </Head>
          <Header />
          <Container {...this.props} className="main">
            {this.props.children}
            {this.store.currentUser ?
              <Intercom
                appID={this.store.common.intercom.appId}
                user={{
                  email: this.store.currentUser.email,
                  fullName: this.store.currentUser.fullName,
                  hash: this.store.currentUser.hash,
                  createdAt: Math.floor(
                    Date.parse(this.store.currentUser.createdAt) / 1000,
                  ).toString(),
                }}
                domain="videoremix.io"
              /> : null}
          </Container>
          <Footer whiteLabel={this.store.common.whiteLabel} />
        </div>
      </Provider>
    );
  }
}

export default Layout;
