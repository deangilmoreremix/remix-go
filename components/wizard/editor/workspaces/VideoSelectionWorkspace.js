import React, { Component, Fragment } from 'react';
import { ButtonGroup, Button } from 'reactstrap';
import { observer, inject } from 'mobx-react';
import { observable, runInAction } from 'mobx';

import {
  PopupboxManager,
} from 'react-popupbox';

import VideoGallery from 'react-masonry-infinite';

import PropTypes from '../../../../lib/PropTypes';
import InfiniteLoading from '../../../common/InfiniteLoading';
import Search from '../../../common/Search';
import InputField from './gridItems/InputField';
import VideoGridItem from './gridItems/VideoGridItem';
import PublishButton from '../../../common/PublishButton';


@inject('api')
@observer
export default class VideoSelectionWorkspace extends Component {
  static propTypes = {
    className: PropTypes.string,
    inWindow: PropTypes.bool,
    onVideoSelected: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const { api } = props;
    this.onSelected = this.onSelected.bind(this);
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

  onPreview = (title, url) => {
    this.currentPlayback = (
      <video className="video-popup" preload autoPlay controls>
        <source src={url} />
      </video>);
    PopupboxManager.open({
      content: this.currentPlayback,
      config: {
        titleBar: {
          enable: true,
          text: title,
        },
        fadeIn: true,
        fadeInSpeed: 200,
      },
    });
  };

  onRename = item => (name) => {
    const { api } = this.props;
    return api.renameAsset(item, name);
  };

  onSearch = async (query) => {
    const { api } = this.props;
    const { scope } = this.state;
    this.setState({
      [scope]: {
        elements: [],
        hasMore: false,
        query,
      },
    });
    const newElements = await api.assets(scope, api.constructor.ASSET_TYPES.VIDEOS, 0, query);
    runInAction(() => {
      this.setState({
        [scope]: {
          elements: newElements,
          hasMore: newElements.length > 0,
          query,
        },
      });
    });
  };
  onSelected = () => {
      console.log("click here");
  }

  onScopeChange = async (scope) => {
    if (scope !== this.state.scope) {
      this.setState({
        scope,
        [scope]: {
          hasMore: true,
          elements: [],
          query: '',
        },
      }, () => {
        this.loadMore();
      });
    }
  };

  @observable
  currentPlayback = null;

  loadMore = async () => {
    const { api } = this.props;
    const { scope } = this.state;
    const { elements, query } = this.state[scope];
    const newElements = await api.assets(
      scope, api.constructor.ASSET_TYPES.VIDEOS, elements.length, query,
    );
    this.setState({
      [scope]: {
        query,
        elements: elements.concat(newElements),
        // for now we have no pagination for such resources
        hasMore: newElements.length > 0,
      },
    });
  };

  render() {
    const { api, className, inWindow = false, onVideoSelected, activeProject } = this.props;
    const { scope } = this.state;
    const { hasMore, elements } = this.state[scope];
    const editable = (scope === api.constructor.ASSET_SCOPES.UPLOADS);

    const sizes = inWindow ?
      [
        { columns: 1, gutter: 20 },
        { mq: '694px', columns: 2, gutter: 20 },
        { mq: '1000px', columns: 3, gutter: 20 },
        { mq: '1536px', columns: 5, gutter: 20 },
      ] : [
        { columns: 1, gutter: 30 },
        { mq: '512px', columns: 2, gutter: 30 },
        { mq: '768px', columns: 3, gutter: 30 },
        { mq: '1024px', columns: 5, gutter: 30 },
        { mq: '1536px', columns: 5, gutter: 30 },
      ];
    return (
      <Fragment>
        <div className='go-button-container'>
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
        <PublishButton  activeProject={activeProject} api={api}/>
        </div>
         {/* <div className='button-container'>
                <button
                  className="go-button action-button mr_15"
                  onClick={() => {
                    this.toggle()
                  }}
                >
                  Preview
                </button>
                <button
                  className="go-button action-button"
                  onClick={async () => {
                    // no need to have it working now, but who knows for future...
                    // if (activeProject.audio) {
                    //   this.setState({
                    //     waiter: {
                    //       message: 'Making your media mobile-friendly...',
                    //     },
                    //   });
                    //   const { url } = await api.mergeMedia(
                    //     activeProject.video,
                    //     activeProject.audio,
                    //   );
                    //   await activeProject.updateAudio(null);
                    //   await activeProject.updateVideo(url);
                    // }
                    this.setState({ waiter: { message: 'Saving your project...' } });
                    const savedProject = await api.publish(await api.save(activeProject));
                    Router.push({
                      pathname: '/publish',
                      query: { project: savedProject.make._id },
                    });
                    this.setState({ waiter: null });
                  }}
                >
                  Publish & Share
                </button>
          </div>
        // </div> */}
        <VideoGallery
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
                onClick={this.onSelected}
              >
                <VideoGridItem
                  item={item}
                  onPreview={this.onPreview}
                  onUse={onVideoSelected}
                />
                {editable &&
                <InputField
                  value={item.title}
                  onSave={this.onRename(item)}
                />}
              </div>))}
        </VideoGallery>
      </Fragment>
    );
  }
}
