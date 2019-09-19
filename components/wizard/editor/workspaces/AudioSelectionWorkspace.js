import React, { Component, Fragment } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import { inject, observer } from 'mobx-react';

import AudioGallery from 'react-masonry-infinite';

import PropTypes from '../../../../lib/PropTypes';
import InfiniteLoading from '../../../common/InfiniteLoading';
import Search from '../../../common/Search';
import InputField from './gridItems/InputField';
import AudioGridItem from './gridItems/AudioGridItem';


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
      [api.constructor.ASSET_SCOPES.LIBRARY]: {
        hasMore: true,
        elements: [],
        query: '',
      },
      [api.constructor.ASSET_SCOPES.UPLOADS]: {
        hasMore: true,
        elements: [],
        query: '',
      },
    };
  }

  onSearch = async (query) => {
    const { scope } = this.state;
    this.setState({
      [scope]: {
        elements: [],
      },
    });
    await this.loadAudio({ elements: [], query });
  };

  onScopeChange = async (scope) => {
    if (scope !== this.state.scope) {
      this.setState({ scope });
    }
  };

  onRename = item => (name) => {
    const { api } = this.props;
    return api.renameAsset(item, name);
  };

  loadAudio = async ({ elements, query }) => {
    const { api } = this.props;
    const { scope } = this.state;
    const newElements = await api.assets(
      scope, api.constructor.ASSET_TYPES.AUDIOS, elements.length, query,
    );
    this.setState({
      [scope]: {
        query,
        elements: elements.concat(newElements),
        hasMore: newElements.length === api.perPage,
      },
    });
  };

  loadMore = async () => {
    const { scope } = this.state;
    const { elements, query } = this.state[scope];
    await this.loadAudio({ elements, query });
  };

  render() {
    const { api, className, inWindow = false, onAudioSelected } = this.props;
    const { scope } = this.state;
    const { hasMore, elements } = this.state[scope];
    console.log('elements', elements)
    const editable = (scope === api.constructor.ASSET_SCOPES.UPLOADS);

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
        <AudioGallery
          useWindow={!inWindow}
          className={`media-gallery ${className}`}
          hasMore={hasMore}
          loader={<InfiniteLoading key="loader" />}
          loadMore={this.loadMore}
          sizes={sizes}
        >
          {
            elements.map((item, idx) => (
              <div
                className="card"
                key={idx}
              >
                <AudioGridItem
                  item={item}
                  onUse={onAudioSelected}
                />
                {editable &&
                <InputField
                  title={item.title}
                  onRename={this.onRename(item)}
                />}
              </div>))}
        </AudioGallery>
      </Fragment>);
  }
}
