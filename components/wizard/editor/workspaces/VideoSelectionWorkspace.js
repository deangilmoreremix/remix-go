import React, { Component, Fragment } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';

import {
  PopupboxManager,
} from 'react-popupbox';

import VideoGallery from 'react-masonry-infinite';

import Search from '../../../common/Search';
import VideoGridItem from './gridItems/VideoGridItem';
import InfiniteLoading from '../../../common/InfiniteLoading';
import PropTypes from '../../../../lib/PropTypes';

@inject('api')
@observer
export default class VideoSelectionWorkspace extends Component {
  static propTypes = {
    className: PropTypes.string,
    inWindow: PropTypes.bool,
    onVideoSelected: PropTypes.func.isRequired,
  };

  state = {
    hasMore: true,
    elements: [],
    query: '',
  };

  onPreview = (title, url) => {
    this.currentPlayback = (
      <video className="video-popup" preload autoPlay controls>
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

  @observable
  currentPlayback = null;

  onSearch = async (query) => {
    this.setState({ elements: [] });
    const { api } = this.props;
    const newElements = await api.assets(api.constructor.ASSET_TYPE.VIDEOS, 0, query);
    this.setState({
      elements: newElements,
      hasMore: newElements.length > 0,
      query,
    });
  };

  loadMore = async () => {
    const { api } = this.props;
    const { elements, query } = this.state;
    const newElements = await api.assets(api.constructor.ASSET_TYPE.VIDEOS, elements.length, query);
    this.setState({
      elements: elements.concat(newElements),
      // for now we have no pagination for such resources
      hasMore: newElements.length > 0,
    });
  };

  render() {
    const { className, inWindow = false, onVideoSelected } = this.props;
    const sizes = inWindow ?
      [
        { columns: 1, gutter: 20 },
        { mq: '694px', columns: 2, gutter: 20 },
        { mq: '1000px', columns: 3, gutter: 20 },
        { mq: '1536px', columns: 4, gutter: 20 },
      ] : [
        { columns: 1, gutter: 30 },
        { mq: '512px', columns: 2, gutter: 30 },
        { mq: '768px', columns: 3, gutter: 30 },
        { mq: '1024px', columns: 4, gutter: 30 },
        { mq: '1536px', columns: 5, gutter: 30 },
      ];
    return (
      <Fragment>
        <Search
          onSearch={q => this.onSearch(q)}
        />
        <VideoGallery
          useWindow={!inWindow}
          className={`media-gallery ${className}`}
          hasMore={this.state.hasMore}
          loader={<InfiniteLoading key="loader" />}
          loadMore={this.loadMore}
          sizes={sizes}
        >
          {
            this.state.elements.map(({ title, url, preview }, idx) => (
              <VideoGridItem
                key={idx}
                title={title}
                url={url}
                preview={preview}
                onPreview={this.onPreview}
                onUse={video => onVideoSelected(video)}
              />
            ))
          }
        </VideoGallery>
      </Fragment>
    );
  }
}
