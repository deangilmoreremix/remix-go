import React, {Component, Fragment} from 'react';
import {Provider, observer, inject} from 'mobx-react';

import TemplateGallery from 'react-masonry-infinite';

import InfiniteLoading from '../common/InfiniteLoading';
import TemplateItem from './templates/TemplateItem';

@inject('templateApi')
@observer
export default class Templates extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasMore: true,
      elements: [],
    };
  }

  loadMore = async () => {
    const { templateApi } = this.props;
    const { elements } = this.state;
    const newElements = await templateApi.list(elements.length);
    this.setState({
      elements: elements.concat(newElements),
      hasMore: newElements.length > 0,
    });
  };

  render() {
    return <Fragment>
      <TemplateGallery
        className="template-gallery"
        hasMore={this.state.hasMore}
        loader={<InfiniteLoading />}
        loadMore={this.loadMore}
      >
        {
          this.state.elements.map(({ _id, title }) => (
            <TemplateItem key={_id} className="card" title={title} height={200}/>
          ))
        }
      </TemplateGallery>
    </Fragment>;
  }
}
