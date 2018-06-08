import React, { Component, Fragment } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';

import CTAGallery from 'react-masonry-infinite';

import Waiter from '../../../common/Waiter';
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
      waiter: null,
    };
  }

  onSearch = async (query) => {
    this.setState({ elements: [] });
    const { api } = this.props;
    const newElements = await api.cta(0, query);
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
    const { waiter } = this.state;

    return (
      <Fragment>
        <div className={className}>
          { waiter ? <Waiter message={waiter.message} /> : null }
          <Search
            onSearch={q => this.onSearch(q)}
          />
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
                    this.setState({ waiter: { message: 'Loading niche script...' } });
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
