import React, { Component, Fragment } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';

import TemplateGallery from 'react-masonry-infinite';
import {
  PopupboxManager,
  PopupboxContainer,
} from 'react-popupbox';

import PropTypes from '../../../lib/PropTypes';
import InfiniteLoading from '../../common/InfiniteLoading';
import TemplateItem from './TemplateItem';
import EmbeddedPlayback from '../../common/EmbeddedPlayback';

@inject('api')
@observer
export default class Templates extends Component {
  static propTypes = {
    onTemplateSelected: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      hasMore: true,
      elements: [],
    };
  }

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

  @observable
  currentPlayback = null;

  loadMore = async () => {
    const { api } = this.props;
    const { elements } = this.state;
    const newElements = await api.templates(elements.length);
    this.setState({
      elements: elements.concat(newElements),
      hasMore: newElements.length > 0,
    });
  };

  render() {
    return (
      <Fragment>
        <PopupboxContainer onClosed={() => { this.currentPlayback.props.url = null; }} />
        <TemplateGallery
          className="wizard-gallery"
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
                onUse={(template) => {
                  const { onTemplateSelected } = this.props;
                  onTemplateSelected(template);
                }}
              />
            ))
          }
        </TemplateGallery>
      </Fragment>);
  }
}
