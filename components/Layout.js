import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import { Container } from 'reactstrap';
import Head from 'next/head';

import { initStoreAndPreload, initStore } from '../globals/store';
import { initApiAndPreload, initApi } from '../globals/api';

import PopcornProxy from '../lib/PopcornProxy';
import Header from './Header';
import Footer from './Footer';
import HelpCrunch from './common/HelpCrunch';
import Intercom from './common/Intercom';
import router from 'next/router';

class Layout extends Component {
  static async getInitialProps({ query, req }, preloader) {
    const isServer = !!req;
    const store = await initStoreAndPreload(isServer, query, req, preloader);
    const api = await initApiAndPreload(isServer, query, req, preloader);
    const pathname = "";
    const querypath = "";
    return { store, api };
  }

  constructor(props) {
    super(props);
    this.state = {path: "", searchQuery: ""};
    this.store = initStore(props.store);
    this.api = initApi(props.api);
  }

  componentDidMount() {
    const {currentUser} = this.props;
    this.pathname = window.location.pathname;
    this.querypath = window.location.search;
    this.setState({path: window.location.pathname, searchQuery: window.location.search})
  }

  componentDidUpdate() {
    const {currentUser} = this.props;
    this.pathname = window.location.pathname;
    this.querypath = window.location.search;
  }
  render() {
    const { store: { whiteLabelManager } } = this.props;
    if (process.browser) {
      PopcornProxy.init(window);
    }
    return (
      <Provider store={this.store} api={this.api}>
        <div>
          {whiteLabelManager.domain === 'videoremix.io'
          && this.store.common.scriptStatistic
            && (
            <div>
              <noscript dangerouslySetInnerHTML={{
                __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WMCHG8T"
                      height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
              }}
              />
              <noscript dangerouslySetInnerHTML={{
                __html: `<img height="1" width="1" style="display:none"
              src="https://www.facebook.com/tr?id=205065714219509&ev=PageView&noscript=1"
          />`,
              }}
              />
            </div>
            )
          }
          <Head>
            <title>
              {whiteLabelManager.brandName}
            </title>
            <link
              rel="shortcut icon"
              href={
                whiteLabelManager.shouldOverride
                  ? `//cdn.vidcloud.io/wl/${whiteLabelManager.domain}/resources/vc_favicon`
                  : '//cdn.vidcloud.io/resources/go/favicon.png'
              }
            />
            {whiteLabelManager.shouldOverride
            && <style dangerouslySetInnerHTML={{ __html: whiteLabelManager.css }} />}
            {/* Google Tag Manager */}
            {whiteLabelManager.domain === 'videoremix.io'
            && this.store.common.scriptStatistic
            && (
            <div>
              <script dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WMCHG8T')`,
              }}
              />
              {/* End Google Tag Manager */}
              {/* Facebook Pixel Code */}
              <script dangerouslySetInnerHTML={{
                __html: `!function (f, b, e, v, n, t, s) { 
                if (f.fbq) return; 
                n = f.fbq = function () { 
                  n.callMethod ? 
                    n.callMethod.apply(n, arguments) : n.queue.push(arguments) 
                }; 
                if (!f._fbq) f._fbq = n; 
                n.push = n; 
                n.loaded = !0; 
                n.version = '2.0'; 
                n.queue = []; 
                t = b.createElement(e); 
                t.async = !0; 
                t.src = v; 
                s = b.getElementsByTagName(e)[0]; 
                s.parentNode.insertBefore(t, s); 
               }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js'); 
                fbq('init', '205065714219509'); 
                fbq('track', 'PageView');`,
              }}
              />
            </div>
            )}
            {/* End Facebook Pixel Code */}
          </Head>
          <div className='site-wrapper'>
          <Header className={`theme-${whiteLabelManager.key} ${(this.state.searchQuery == "" && this.state.path == "/") ? "welcome-page" : ""}`} />
          <div {...this.props} className={`${(this.state.searchQuery == "" && this.state.path == "/") ? "welcome-page" : ""} main theme-${whiteLabelManager.key}`}>
            {this.props.children}
            {this.store.currentUser && whiteLabelManager.domain === 'videoremix.io'
              ? (
                <HelpCrunch
                  applicationId={this.store.common.helpCrunch.applicationId}
                  applicationSecret={this.store.common.helpCrunch.applicationSecret}
                  user={{
                    email: this.store.currentUser.email,
                    fullName: this.store.currentUser.fullName,
                    hash: this.store.currentUser.hash,
                  }}
                />
              ) : null}
            {this.store.currentUser && whiteLabelManager.domain === 'videoremix.io'
              ? (
                <Intercom
                  appID={this.store.common.intercom.appId}
                  user={{
                    email: this.store.currentUser.email,
                    fullName: this.store.currentUser.fullName,
                    hash: this.store.currentUser.intercomHash,
                    createdAt: Math.floor(
                      Date.parse(this.store.currentUser.createdAt) / 1000,
                    ).toString(),
                  }}
                  domain="videoremix.io"
                />
              ) : null}
          </div>
          </div>
        </div>
      </Provider>
    );
  }
}

export default Layout;
