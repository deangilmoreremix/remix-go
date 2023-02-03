import React, { Component, Fragment } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';

import TemplateGallery from 'react-masonry-infinite';
import {
  PopupboxManager,
  PopupboxContainer,
} from 'react-popupbox';

import { DropdownMenu, DropdownItem, Dropdown, DropdownToggle } from 'reactstrap';

import PropTypes from '../../../lib/PropTypes';
import InfiniteLoading from '../../common/InfiniteLoading';
import Search from '../../common/Search';
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

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
    };

    this.state = {
      dropdownOpen: false,
      hasMore: true,
      elements: [],
      query: '',
    };
  }


  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
  onPreview = (template) => {
    this.currentPlayback = (<EmbeddedPlayback
      source={template.url}
      title={template.title}
      width="840"
      height="480"
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
    this.setState({ elements: [] });
    const { api } = this.props;
    const newElements = await api.templates(0, query);
    this.setState({
      elements: newElements
    })
  };

  @observable
  currentPlayback = null;

  loadMore = async () => {
    const { api } = this.props;
    const { elements } = this.state;
    const { query } = this.state;
    const newElements = await api.templates(elements.length, query);
    this.setState({
      elements: elements.concat(newElements),
      hasMore: newElements.length > 0,
      query,
    });
  };

  render() {
    return (
      <Fragment>
        <PopupboxContainer
          ref={(c) => { this.popupboxContainer = c; }}
          onClosed={() => {
            this.popupboxContainer.state.children = null;
          }}
        />
        <div className='choose-template-container'>
          <Search
            onSearch={q => this.onSearch(q)}
            placeholder="Search through your templates..."
          />
          <Dropdown isOpen={this.state.isOpen} toggle={this.toggle} direction={'down'} className={'select-niche-dropdown'}>
            <DropdownToggle caret>
              Select Niches
            </DropdownToggle>
            <DropdownMenu container="body">
              <DropdownItem>Foo Action</DropdownItem>
              <DropdownItem>Bar Action</DropdownItem>
              <DropdownItem>Quo Action</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className='template_content'>
          <div className='template_items'>
            {this.state.elements.map((item, idx) => (
              <div className='template-wrapper'>
                <div className='template_item' key={idx}>
                  <div className='img-wrapper'>
                    <img src={item.thumbnail}></img>
                  </div>
                  <div className='template_data'>
                    <div class="buttons-container">
                      <a class="button btn-preview" onClick={() => { this.onPreview(item) }}><img src={'/static/images/play-icon.png'}></img></a>
                      <p>{item.title}</p>
                      <a class="btn btn-primary btn-small" onClick={() => this.props.onTemplateSelected(item)}>use</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
            { mq: '1536px', columns: 4, gutter: 30 },
          ]}
        >
          <div></div>
        </TemplateGallery>
      </Fragment>);
  }
}
