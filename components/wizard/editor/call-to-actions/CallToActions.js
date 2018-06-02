import React, { Component, Fragment } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';

import CTAGallery from 'react-masonry-infinite';

import PropTypes from '../../../../lib/PropTypes';
import InfiniteLoading from '../../../common/InfiniteLoading';
import Search from '../../../common/Search';
import CTAItem from './CTAItem';

@inject('api')
@observer
export default class CallToActions extends Component {
  static propTypes = {
    className: PropTypes.string,
    onCtaSelected: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      hasMore: true,
      elements: [],
      query: '',
    };
  }

  onSearch = async (query) => {
    const { api } = this.props;
    const { elements } = this.state;
    const newElements = await api.cta(elements.length, query);
    this.setState({
      elements: newElements,
      hasMore: newElements.length > 0,
      query,
    });
  };

  @observable
  currentPlayback = null;

  loadMore = async () => {
    const { api } = this.props;
    const { elements } = this.state;
    const { query } = this.state;
    const newElements = await api.cta(elements.length, query);
    this.setState({
      elements: elements.concat(newElements),
      hasMore: newElements.length > 0,
      query,
    });
  };

  render() {
    const { className } = this.props;
    return (
      <Fragment>
        <div className={className}>
          {/*<Search onSearch={q => this.onSearch(q)} />*/}
          <CTAGallery
            className="cta-library-inner"
            useWindow={false}
            hasMore={this.state.hasMore}
            loader={<InfiniteLoading key="loader" />}
            loadMore={this.loadMore}
            sizes={[
              { columns: 1, gutter: 30 },
              { mq: '512px', columns: 2, gutter: 30 },
              { mq: '768px', columns: 3, gutter: 30 },
              { mq: '1024px', columns: 4, gutter: 30 },
              { mq: '1536px', columns: 5, gutter: 30 },
            ]}
          >
            {
              this.state.elements.map((item, idx) => (
                <CTAItem
                  key={idx}
                  cta={item}
                  onUse={(cta) => {
                    const { onCtaSelected } = this.props;
                    onCtaSelected(cta);
                  }}
                />
              ))
            }
          </CTAGallery>
        </div>
      </Fragment>);
  }
}
