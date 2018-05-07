import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { inject, observer } from 'mobx-react';

import AudioGallery from 'react-masonry-infinite';

import AudioGridItem from './gridItems/AudioGridItem';
import InfiniteLoading from '../../../common/InfiniteLoading';
import PropTypes from '../../../../lib/PropTypes';

@inject('api')
@observer
export default class AudioSelectionWorkspace extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  state = {
    hasMore: true,
    elements: [],
  };

  loadMore = async () => {
    const { api } = this.props;
    const { elements } = this.state;
    const newElements = await api.list(elements.length);
    this.setState({
      elements: elements.concat(newElements),
      hasMore: newElements.length > 0,
    });
  };

  render() {
    const { className } = this.props;
    return (
      <Container className={className}>
        <AudioGallery
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
            this.state.elements.map((item, idx) => (
              <AudioGridItem
                key={idx}
                template={item}
                onUse={this.onUse}
              />
            ))
          }
        </AudioGallery>
      </Container>);
  }
}
