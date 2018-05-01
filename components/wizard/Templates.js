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
    const {templateApi} = this.props;
    const {elements} = this.state;
    const newElements = await templateApi.list(elements.length);
    this.setState({
      elements: elements.concat(newElements),
      hasMore: newElements.length > 0,
    });
  };

  onUse = (template) => {
    // TODO: implement transition to editor
    console.log(`using ${template.title}`);
  };

  onPreview = (template) => {
    // TODO: implement preview
    console.log(`previewing ${template.title}`);
  };

  render() {
    return <Fragment>
      <TemplateGallery
        className="template-gallery"
        hasMore={this.state.hasMore}
        loader={<InfiniteLoading key="loader" />}
        loadMore={this.loadMore}
        sizes={[
          {columns: 1, gutter: 30},
          {mq: '512px', columns: 2, gutter: 30},
          {mq: '768px', columns: 3, gutter: 30},
          {mq: '1024px', columns: 4, gutter: 30},
          {mq: '1536px', columns: 5, gutter: 30}
        ]}
      >
        {
          this.state.elements.map((item, idx) => (
            <TemplateItem
              key={idx}
              template={item}
              onPreview={this.onPreview}
              onUse={this.onUse}
            />
          ))
        }
      </TemplateGallery>
    </Fragment>;
  }
}
