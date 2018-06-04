import React from 'react';
import Document, { Main, NextScript } from 'next/document';
import stylesheet from 'styles/index.scss';

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
    return (
      <html lang="en">
        <head>
          <title>VideoRemix GO</title>
          <link rel="shortcut icon" href="//cdv.vidcloud.io/wl/videoremix.io/resources/vc_favicon" />
        </head>
        <body>
          {/* eslint-disable react/no-danger */}
          <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
          {/* eslint-enable react/no-danger */}
          {this.props.customValue}
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
