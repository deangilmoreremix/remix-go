import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';

import TemplateGallery from 'react-masonry-infinite';
import {
  PopupboxManager,
  PopupboxContainer,
} from 'react-popupbox';

import InfiniteLoading from '../common/InfiniteLoading';
import TemplateItem from './templates/TemplateItem';
import EmbeddedPlayback from '../common/EmbeddedPlayback';

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

  onUse = (template) => {
    // TODO: implement transition to editor
    console.log(`using ${template.title}`);
  };

  onPreview = (template) => {
    PopupboxManager.open({
      content: <EmbeddedPlayback
        url={template.url}
        title={template.title}
        width={840}
        height={480}
      />,
      config: {
        titleBar: {
          enable: true,
          text: template.title,
        },
        fadeIn: true,
        fadeInSpeed: 200,
      },
    });
  };

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
    return (
      <Fragment>
        <PopupboxContainer />
        <TemplateGallery
          className="template-gallery"
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
              <TemplateItem
                key={idx}
                template={item}
                onPreview={this.onPreview}
                onUse={this.onUse}
              />
            ))
          }
        </TemplateGallery>
      </Fragment>);
  }
}
