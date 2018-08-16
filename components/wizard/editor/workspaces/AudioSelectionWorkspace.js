import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';

import AudioGallery from 'react-masonry-infinite';

import Search from '../../../common/Search';
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
    query: '',
  };

  onSearch = async (query) => {
    this.setState({ elements: [] });
    const { api } = this.props;
    const newElements = await api.assets(api.constructor.ASSET_TYPE.AUDIOS, 0, query);
    this.setState({
      elements: newElements,
      hasMore: newElements.length > 0,
      query,
    });
  };

  loadMore = async () => {
    const { api } = this.props;
    const { elements, query } = this.state;
    const newElements = await api.assets(api.constructor.ASSET_TYPE.AUDIOS, elements.length, query);
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
        <Search
          onSearch={q => this.onSearch(q)}
        />
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
                onUse={audio => onAudioSelected(audio)}
              />
            ))
          }
        </AudioGallery>
      </Fragment>);
  }
}
