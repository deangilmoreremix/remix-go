import React, { Component, Fragment } from 'react';
import Router from 'next/router';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';

import TemplateGallery from 'react-masonry-infinite';
import {
  PopupboxManager,
  PopupboxContainer,
} from 'react-popupbox';

import Project from '../../lib/editor/Project';
import InfiniteLoading from '../common/InfiniteLoading';
import TemplateItem from './templates/TemplateItem';
import EmbeddedPlayback from '../common/EmbeddedPlayback';
import Search from './templates/Search';

@inject('api')
@inject('store')
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
    const { store } = this.props;
    store.activeProject = new Project(JSON.parse(template.project.data));
    return Router.push({ pathname: '/edit' });
  };


  onPreview = (template) => {
    this.currentPlayback = (<EmbeddedPlayback
      url={template.url}
      title={template.title}
      width={840}
      height={480}
    />);
    PopupboxManager.open({
      content: this.currentPlayback,
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

  onSearch = async (query) => {
    const { api } = this.props;
    const queryElements = await api.list(null, query);
    this.setState({
      elements: elements.concat(queryElements),
      hasMore: queryElements.length > 0,
    });
  };

  @observable
  currentPlayback = null;


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
    return (
      <Fragment>
        <Search 
          onSearch={this.onSearch}
        />

        <PopupboxContainer onClosed={() => { this.currentPlayback.props.url = null; }} />
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
