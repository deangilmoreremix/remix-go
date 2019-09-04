import React, { Component, Fragment } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import { inject, observer } from 'mobx-react';

import AudioGallery from 'react-masonry-infinite';

import Search from '../../../common/Search';
import AudioGridItem from './gridItems/AudioGridItem';
import InfiniteLoading from '../../../common/InfiniteLoading';
import PropTypes from '../../../../lib/PropTypes';

@inject('api')
@observer
export default class AudioSelectionWorkspace extends Component {
  static propTypes = {
    className: PropTypes.string,
    inWindow: PropTypes.bool,
    onAudioSelected: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const { api } = props;
    this.state = {
      scope: api.constructor.ASSET_SCOPES.LIBRARY,
      hasMore: true,
      elements: [],
      query: '',
    };
  }

  onSearch = async (query) => {
    this.setState({ elements: [], hasMore: false });
    const { api } = this.props;
    const { scope } = this.state;
    const newElements = await api.assets(scope, api.constructor.ASSET_TYPES.AUDIOS, 0, query);
    this.setState({
      elements: newElements,
      hasMore: newElements.length > 0,
      query,
    });
  };

  onScopeChange = async (scope) => {
    this.state = {
      scope,
      elements: [],
      hasMore: true,
      query: '',
    };
    await this.loadMore();
  };

  loadMore = async () => {
    const { api } = this.props;
    const { scope, elements, query } = this.state;
    const newElements = await api.assets(
      scope, api.constructor.ASSET_TYPES.AUDIOS, elements.length, query,
    );
    this.setState({
      elements: elements.concat(newElements),
      // for now we have no pagination for such resources
      hasMore: newElements.length > 0,
    });
  };

  render() {
    const { api, className, inWindow = false, onAudioSelected } = this.props;
    const { scope, hasMore, elements } = this.state;

    const sizes = inWindow ?
      [
        { columns: 1, gutter: 20 },
        { mq: '694px', columns: 2, gutter: 20 },
        { mq: '1000px', columns: 3, gutter: 20 },
        { mq: '1536px', columns: 4, gutter: 20 },
      ] : [
        { columns: 1, gutter: 30 },
        { mq: '512px', columns: 2, gutter: 30 },
        { mq: '768px', columns: 3, gutter: 30 },
        { mq: '1024px', columns: 4, gutter: 30 },
        { mq: '1536px', columns: 5, gutter: 30 },
      ];
    return (
      <Fragment>
        <ButtonGroup className="go-switch flex-center">
          <Button
            onClick={() => this.onScopeChange(api.constructor.ASSET_SCOPES.LIBRARY)}
            active={scope === api.constructor.ASSET_SCOPES.LIBRARY}
          >
            Library
          </Button>
          <Button
            onClick={() => this.onScopeChange(api.constructor.ASSET_SCOPES.UPLOADS)}
            active={scope === api.constructor.ASSET_SCOPES.UPLOADS}
          >
            Uploads
          </Button>
        </ButtonGroup>
        <Search
          onSearch={q => this.onSearch(q)}
        />
        {scope === api.constructor.ASSET_SCOPES.LIBRARY && <AudioGallery
          useWindow={!inWindow}
          className={`media-gallery ${className}`}
          hasMore={hasMore}
          loader={<InfiniteLoading key="loader" />}
          loadMore={this.loadMore}
          sizes={sizes}
        >
          {
            elements.map(({ title, url, artwork }, idx) => (
              <AudioGridItem
                key={idx}
                title={title}
                url={url}
                artwork={artwork}
                onUse={audio => onAudioSelected(audio)}
              />
            ))
          }
        </AudioGallery>}
        {scope === api.constructor.ASSET_SCOPES.UPLOADS && console.log('api',api)}
      </Fragment>);
  }
}
