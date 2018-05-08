import React, { Component, Fragment } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';

import {
  PopupboxManager,
  PopupboxContainer,
} from 'react-popupbox';
import Router from 'next/router';

import VideoGallery from 'react-masonry-infinite';

import VideoGridItem from './gridItems/VideoGridItem';
import InfiniteLoading from '../../../common/InfiniteLoading';
import PropTypes from '../../../../lib/PropTypes';

@inject('api')
@observer
export default class VideoSelectionWorkspace extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  @observable
  currentPlayback = null;

  state = {
    hasMore: true,
    elements: [],
  };

  onUse = () => Router.push({ pathname: '/publish' });

  onPreview = (title, url) => {
    this.currentPlayback = (
      <video className="video" preload autoPlay controls style={{width: '100%', height: '100%'}}>
        <source src={url} />
      </video>);
    PopupboxManager.open({
      content: this.currentPlayback,
      config: {
        titleBar: {
          enable: true,
          text: title,
        },
        fadeIn: true,
        fadeInSpeed: 200,
      },
    });
  };

  loadMore = async () => {
    const { api } = this.props;
    const { elements } = this.state;
    const newElements = await api.assets(api.constructor.ASSET_TYPE.VIDEOS, elements.length);
    this.setState({
      elements: elements.concat(newElements),
      // for now we have no pagination for such resources
      hasMore: false,
    });
  };

  render() {
    const { className } = this.props;
    return (
      <Fragment>
        <PopupboxContainer onClosed={() => {
          delete this.currentPlayback.props.children;
        }} />
        <VideoGallery
          useWindow={false}
          className={`media-gallery ${className}`}
          hasMore={this.state.hasMore}
          loader={<InfiniteLoading key="loader" />}
          loadMore={this.loadMore}
          sizes={[
            { columns: 1, gutter: 20 },
            { mq: '694px', columns: 2, gutter: 20 },
            { mq: '1000px', columns: 3, gutter: 20 },
            { mq: '1536px', columns: 4, gutter: 20 },
          ]}
        >
          {
            this.state.elements.map(({ title, url, preview }, idx) => (
              <VideoGridItem
                key={idx}
                title={title}
                url={url}
                preview={preview}
                onPreview={this.onPreview}
                onUse={this.onUse}
              />
            ))
          }
        </VideoGallery>
      </Fragment>
    );
  }
}
