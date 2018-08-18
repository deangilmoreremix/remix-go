import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import stylesheet from 'styles/index.scss';
import { inject } from 'mobx-react';

@inject('store')
export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const {
      html, head, errorHtml, chunks,
    } = renderPage();
    return {
      html, head, errorHtml, chunks,
    };
  }

  render() {
    const { customValue, store: { activeProject } } = this.props;

    return (
      <html lang="en">
        <Head>
          <title>{activeProject ? `${activeProject.name} - VideoRemix GO` : 'VideoRemix GO'}</title>
          <link rel="shortcut icon" href="//cdn.vidcloud.io/resources/go/favicon.png" />
        </Head>
        <body>
          {/* eslint-disable react/no-danger */}
          <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
          {/* eslint-enable react/no-danger */}
          {customValue}
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
