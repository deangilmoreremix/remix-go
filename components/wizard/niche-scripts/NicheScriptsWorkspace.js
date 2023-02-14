import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';

import NicheScriptsList from 'react-masonry-infinite';

import Waiter from '../../common/Waiter';
import Search from '../../common/Search';
import PropTypes from '../../../lib/PropTypes';
import InfiniteLoading from '../../common/InfiniteLoading';
import NicheScriptItem from './NicheScriptItem';

@inject('api')
@inject('store')
@observer
export default class NicheScriptsWorkspace extends Component {
  static propTypes = {
    onScriptSelected: PropTypes.func.isRequired,
    className: PropTypes.string,
    useWaiter: PropTypes.bool,
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

  onUse = (item) => {
    const { onScriptSelected } = this.props;
    this.setState({ waiter: { message: 'Loading niche script...' } });
    onScriptSelected(item);
  };

  onSearch = async (query) => {
    this.setState({ elements: [] });
    const { api } = this.props;
    const newElements = await api.nicheScripts(0, query);
    this.setState({
      elements: newElements,
      hasMore: newElements.length > 0,
      query,
    });
  };

  loadMore = async () => {
    const { api } = this.props;
    const { elements, query } = this.state;
    const newElements = await api.nicheScripts(elements.length, query);
    this.setState({
      elements: elements.concat(newElements),
      hasMore: newElements.length > 0,
    });
  };

  render() {
    const { className, useWaiter } = this.props;
    const { waiter } = this.state;
    return (
      <Fragment>
        <div className='niche-component'>
        { waiter && useWaiter ? <Waiter message={waiter.message} /> : null }
        <Search
          onSearch={q => this.onSearch(q)}
        />
        <div className={className}>
          <NicheScriptsList
            className="wizard-list"
            useWindow={false}
            hasMore={this.state.hasMore}
            loader={<InfiniteLoading key="loader" />}
            loadMore={this.loadMore}
            sizes={[{ columns: 1, gutter: 30 }]}
          >
            {
              this.state.elements.map((item, idx) => (
                <NicheScriptItem
                  key={idx}
                  script={item}
                  onUse={this.onUse}
                />
              ))
            }
          </NicheScriptsList>
        </div>
        </div>
      </Fragment>
      );
  }
}
