import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';

import NicheScriptsList from 'react-masonry-infinite';

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
  };

  constructor(props) {
    super(props);

    this.state = {
      hasMore: true,
      elements: [],
    };
  }

  onUse = (item) => {
    const { onScriptSelected } = this.props;
    onScriptSelected(item);
  };

  loadMore = async () => {
    const { api } = this.props;
    const { elements } = this.state;
    const newElements = await api.nicheScripts(elements.length);
    this.setState({
      elements: elements.concat(newElements),
      hasMore: newElements.length > 0,
    });
  };

  render() {
    const { className } = this.props;
    return (
      <Fragment>
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
      </Fragment>);
  }
}
