import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';

import {
  PopupboxManager,
} from 'react-popupbox';

import AudioGallery from 'react-masonry-infinite';

import AudioGridItem from './gridItems/AudioGridItem';
import InfiniteLoading from '../../../common/InfiniteLoading';
import PropTypes from '../../../../lib/PropTypes';

@inject('api')
@observer
export default class AudioSelectionWorkspace extends Component {
  static propTypes = {
    className: PropTypes.string,
    inWindow: PropTypes.bool,
    onAudioSelected: PropTypes.func.isRequired,
  };

  state = {
    hasMore: true,
    elements: [],
  };

  onPreview = (title, url) => {
    this.currentPlayback = (
      <audio controls>
        <source src={url} />
      </audio>);
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
    const newElements = await api.assets(api.constructor.ASSET_TYPE.AUDIOS, elements.length);
    this.setState({
      elements: elements.concat(newElements),
      // for now we have no pagination for such resources
      hasMore: newElements.length > 0,
    });
  };

  render() {
    const { className, inWindow = false, onAudioSelected } = this.props;
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
        <AudioGallery
          useWindow={!inWindow}
          className={`media-gallery ${className}`}
          hasMore={this.state.hasMore}
          loader={<InfiniteLoading key="loader" />}
          loadMore={this.loadMore}
          sizes={sizes}
        >
          {
            this.state.elements.map(({ title, url, artwork }, idx) => (
              <AudioGridItem
                key={idx}
                title={title}
                url={url}
                artwork={artwork}
                onPreview={this.onPreview}
                onUse={audio => onAudioSelected(audio)}
              />
            ))
          }
        </AudioGallery>
      </Fragment>);
  }
}
