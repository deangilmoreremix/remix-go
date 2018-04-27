import React from 'react';

import Layout from '../Layout';

export default (RootComponent, className, preloader) => (
  class Page extends React.Component {
    static async getInitialProps(props) {
      return Layout.getInitialProps(props, preloader);
    }

    render() {
      return (
        <Layout className={className} {...this.props}>
          <RootComponent />
        </Layout>
      );
    }
  }
);
