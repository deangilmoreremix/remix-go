import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
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
        <Head>
          <title>VidCloud Light Video Editor</title>
        </Head>
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
