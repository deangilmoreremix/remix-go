import React, { Component, Fragment } from 'react';
import { Progress, Input } from 'reactstrap';
import { inject, observer } from 'mobx-react';

import Project from '../../../../lib/editor/Project';
import PropTypes from '../../../../lib/PropTypes';
import EmbedDataContainer from '../EmbedDataContainer';
import FacebookPostPreview from './FacebookPostPreview';
import InfiniteLoading from '../../../common/InfiniteLoading';

const FB_APP_ID = '1728968890675795';
const FACEBOOK_PERMISSIONS = 'manage_pages,pages_show_list';
const FB_DEFAULT_USERPIC = 'http://emblemsbf.com/img/11864.jpg';
const BACKEND_URL = '//api.videoremix.io';

const EMBED_LOCATIONS = [
  {
    key: 'default',
    label: 'Direct (Default Hosting)',
  },
  {
    key: 'leadpages',
    label: 'LeadPages',
    prompt: 'Copy and paste this embed code into your LeadPage',
    embedGenerator: (url, width, height) => `<iframe id='vr' src='${url}' width='${width}' height='${height}' frameborder='0' mozallowfullscreen webkitallowfullscreen allowfullscreen></iframe>`,
  },
  {
    key: 'wordpress',
    label: 'WordPress',
    prompt: 'Copy and paste this embed code into your WordPress',
    embedGenerator: (url, width, height) => `<iframe id='vr' src='${url}' width='${width}' height='${height}' frameborder='0' mozallowfullscreen webkitallowfullscreen allowfullscreen></iframe>`,
  },
  {
    key: 'optimizepress',
    label: 'OptimizePress 2.0',
    prompt: 'Copy and paste this embed code into your Video Player OP 2.0 element',
    embedGenerator: (url, width, height) => `<iframe id='vr' src='${url}' width='${width}' height='${height}' frameborder='0' mozallowfullscreen webkitallowfullscreen allowfullscreen></iframe>`,
  },
  {
    key: 'facebook-page',
    label: 'Facebook Page',
  },
  {
    key: 'other',
    label: 'Other',
    prompt: 'Copy & Paste this embed code inside the custom HTML element',
    embedGenerator: (url, width, height) => `<iframe id='vr' src='${url}' width='${width}' height='${height}' frameborder='0' mozallowfullscreen webkitallowfullscreen allowfullscreen></iframe>`,
  },
];

@inject('api')
@observer
export default class SocialCampaign extends Component {
  static propTypes = {
    className: PropTypes.string,
    project: PropTypes.instanceOf(Project).isRequired,
    onCampaignFinished: PropTypes.func,
    facebookConductor: PropTypes.node.isRequired,
  };

  static FACEBOOK_MESSAGE_TOPICS = {
    logIn: 'LOG_IN',
    settleAuth: 'SETTLE_AUTH',
    init: 'INIT',
    fetchUserData: 'FETCH_USER_DATA',
    fetchPagesData: 'FETCH_PAGE_DATA',
    getPageTabs: 'GET_PAGE_TABS',
    createTab: 'CREATE_TAB',
    share: 'SHARE',
  };

  static TOPIC_LOADING_MESSAGES = {
    logIn: 'Logging in...',
    settleAuth: 'Checking current authorization...',
    init: '',
    fetchUserData: 'Retrieving your profile data...',
    fetchPagesData: 'Retrieving your pages list...',
    getPageTabs: 'Retrieving page tabs list...',
    createTab: 'Creating page tab...',
    share: 'Sharing your post...',
  };

  static STAGES = [
    { key: 'embed-engine', completionPercentage: 25 },
    { key: 'embed-location', completionPercentage: 25 },
    {
      key: 'facebook-login',
      completionPercentage: 50,
      bootstrap: (instance) => {
        instance.postFacebookMessage({
          topic: instance.constructor.FACEBOOK_MESSAGE_TOPICS.init,
          arguments: FB_APP_ID,
        });
      },
    },
    {
      key: 'facebook-page',
      completionPercentage: 50,
      bootstrap: (instance) => {
        instance.postFacebookMessage({
          topic: instance.constructor.FACEBOOK_MESSAGE_TOPICS.fetchPagesData,
        });
      },
    },
    {
      key: 'facebook-post',
      completionPercentage: 75,
      bootstrap: (instance) => {
        const { project } = instance.props;
        const { facebookPages, facebookPageTab, selectedFbPage } = instance.state;
        if (selectedFbPage.length > 0 && !facebookPageTab.id) {
          const fbPage = facebookPages.find(page => page.id === selectedFbPage);
          instance.postFacebookMessage({
            topic: instance.constructor.FACEBOOK_MESSAGE_TOPICS.createTab,
            arguments: {
              pageId: fbPage.id,
              pageAccessToken: fbPage.token,
              tabName: facebookPageTab.name,
            },
          });
        } else {
          instance.postFacebookMessage({
            topic: instance.constructor.FACEBOOK_MESSAGE_TOPICS.fetchUserData,
          });
        }
        instance.setState({
          facebookPostData: {
            title: project.name,
            thumbnail: project.thumbnail,
            description: project.description,
            link: project.make.url,
          },
        });
      },
    },
  ];

  state = {
    isLoading: false,
    loadingMessage: '',
    currentStage: this.constructor.STAGES[0],
    embedLocation: EMBED_LOCATIONS[0],
    preload: true,
    autoplay: false,
    embedPage: '',
    facebookPages: [],
    selectedFbPage: '',
    facebookPageTab: {
      id: null,
      name: '',
    },
    facebookUserData: {},
    facebookPostData: {},
  };

  componentDidMount() {
    window.addEventListener('message', e => this.receiveFacebookMessage(e));
  }

  componentWillUnmount() {
    window.removeEventListener('message', e => this.receiveFacebookMessage(e));
  }

  setStage(stageName) {
    let { currentStage } = this.state;
    if (currentStage.key === stageName) {
      return;
    }
    currentStage = this.constructor.STAGES.find(item => item.key === stageName);
    this.setState({ currentStage });
    currentStage.bootstrap(this);
    if (currentStage.bootstrap) {
      currentStage.bootstrap(this);
    }
  }

  facebookMessageHandlers = {
    [this.constructor.FACEBOOK_MESSAGE_TOPICS.settleAuth]: (data) => {
      const { error } = data;
      if (error) {
        alert(error.message);
        return this.setStage('facebook-login');
      }
      if (data.loggedIn) {
        return this.nextStage();
      }
      return this.setStage('facebook-login');
    },
    [this.constructor.FACEBOOK_MESSAGE_TOPICS.logIn]: (data) => {
      const err = data.error;
      if (err) {
        return this.setStage('facebook-login');
      }
      return this.nextStage();
    },
    [this.constructor.FACEBOOK_MESSAGE_TOPICS.init]: () => {
      this.postFacebookMessage({
        topic: this.constructor.FACEBOOK_MESSAGE_TOPICS.settleAuth,
        arguments: FACEBOOK_PERMISSIONS,
      });
    },
    [this.constructor.FACEBOOK_MESSAGE_TOPICS.fetchPagesData]: (data) => {
      const { error, result } = data;
      const facebookPages = [];
      if (error) {
        return alert(error.message);
      }
      if (result.length) {
        result.forEach((page) => {
          facebookPages.push({
            id: page.id,
            name: page.name,
            token: page.access_token,
            fanCount: page.fan_count,
          });
        });
        this.setState({ facebookPages });
      }
    },
    [this.constructor.FACEBOOK_MESSAGE_TOPICS.getPageTabs]: (data) => {
      const { error, result } = data;
      if (error) {
        return alert(error.message);
      }

      result.data.forEach((tab) => {
        const tabAppId = tab.application && tab.application.id;
        if (tabAppId === FB_APP_ID) {
          this.setState({
            facebookPageTab: {
              name: tab.name,
              id: tab.id,
            },
          });
        }
      });
    },
    [this.constructor.FACEBOOK_MESSAGE_TOPICS.fetchUserData]: (data) => {
      const { error, result } = data;
      const facebookUserData = error ? {
        name: 'You',
        userpic: FB_DEFAULT_USERPIC,
      } : {
        name: result.NAME,
        userpic: result.IMAGE || FB_DEFAULT_USERPIC,
      };

      this.setState({ facebookUserData });
    },
    [this.constructor.FACEBOOK_MESSAGE_TOPICS.share]: async (data) => {
      const { error } = data;
      const { api, project } = this.props;
      const { preload, autoplay, embedLocation, selectedFbPage } = this.state;
      if (error) {
        return alert(error.message || 'Unable to post');
      }

      this.collapseConductor();

      if (embedLocation.key === 'facebook-page') {
        const queryString = [
          autoplay ? 'autoplay=true' : null,
          !preload ? 'preload=none' : null,
        ].filter(item => !!item).join('&');

        await api.linkToFbPage(project, selectedFbPage, queryString);
      }
    },
    [this.constructor.FACEBOOK_MESSAGE_TOPICS.createTab]: (data) => {
      const { error, result } = data;
      const { facebookPageTab } = this.state;

      if (error) {
        return alert(error.message);
      }
      const parsedTabUrl = result.url.split('/');
      facebookPageTab.id = parsedTabUrl[parsedTabUrl.length - 1];
      if (!facebookPageTab.id) {
        facebookPageTab.id = parsedTabUrl[parsedTabUrl.length - 2];
      }
      this.postFacebookMessage({ topic: this.constructor.FACEBOOK_MESSAGE_TOPICS.fetchUserData });
    },
  };

  nextStage() {
    const { embedLocation } = this.state;
    let { currentStage } = this.state;
    let nextStageIdx = Math.min(
      this.constructor.STAGES.findIndex(item => currentStage.key === item.key) + 1,
      this.constructor.STAGES.length - 1,
    );
    if (this.constructor.STAGES[nextStageIdx].key === 'embed-location' &&
      ['default', 'facebook-page'].indexOf(embedLocation.key) !== -1) {
      nextStageIdx += 1;
    }
    if (this.constructor.STAGES[nextStageIdx].key === 'facebook-page' && embedLocation.key !== 'facebook-page') {
      nextStageIdx += 1;
    }
    currentStage = this.constructor.STAGES[nextStageIdx];
    this.setState({ currentStage });
    if (currentStage.bootstrap) {
      currentStage.bootstrap(this);
    }
  }

  postFacebookMessage(data) {
    const { facebookConductor } = this.props;
    this.setState({
      isLoading: true,
      loadingMessage: this.constructor.TOPIC_LOADING_MESSAGES[data.topic],
    });
    facebookConductor.contentWindow.postMessage({
      topic: data.topic,
      arguments: data.arguments,
    }, facebookConductor.src);
  }

  prevStage() {
    const { embedLocation } = this.state;
    let { currentStage } = this.state;
    let prevStageIdx = Math.min(
      this.constructor.STAGES.findIndex(item => currentStage.key === item.key) - 1,
      0,
    );
    if (this.constructor.STAGES[prevStageIdx].key === 'embed-location' && embedLocation.key === 'default') {
      prevStageIdx -= 1;
    }
    if (this.constructor.STAGES[prevStageIdx].key === 'facebook-page' && embedLocation.key !== 'facebook-page') {
      prevStageIdx -= 1;
    }
    currentStage = this.constructor.STAGES[prevStageIdx];
    this.setState({ currentStage });
  }

  receiveFacebookMessage(e) {
    const { topic } = e.data;

    this.setState({ isLoading: false });
    if (this.facebookMessageHandlers[topic]) {
      this.facebookMessageHandlers[topic](e.data);
    }
  }

  async sharePost() {
    const { api, project, onCampaignFinished } = this.props;
    const {
      autoplay,
      preload,
      embedLocation,
      selectedFbPage,
      embedPage,
      facebookPostData,
    } = this.state;
    const shareOptions = {
      shouldCreateTab: embedLocation.key === 'facebook-page',
    };
    if (embedLocation.key === 'facebook-page') {
      shareOptions.pageId = selectedFbPage;
      shareOptions.redirectUrl =
        `${BACKEND_URL}/api/makes/fb/${shareOptions.pageId}/${FB_APP_ID}?mid=${project.make._id}`;
    } else if (embedLocation.key === 'default') {
      shareOptions.redirectUrl = project.make.url;
    } else {
      shareOptions.redirectUrl = embedPage;
    }
    shareOptions.projectUrl = project.make.url;
    shareOptions.projectUrl = [
      project.make.url, [
        autoplay ? 'autoplay=true' : null,
        !preload ? 'preload=none' : null,
      ].filter(item => !!item).join('&'),
    ].join('?');
    shareOptions.backendUrl = BACKEND_URL;
    if (facebookPostData.title) {
      project.name = facebookPostData.title;
    }
    if (facebookPostData.description) {
      project.description = facebookPostData.description;
    }
    if (facebookPostData.thumbnail) {
      project.thumbnail = facebookPostData.thumbnail;
    }
    await api.publish(await api.save(project));
    onCampaignFinished();
    this.expandConductor();
    this.postFacebookMessage({
      topic: this.constructor.FACEBOOK_MESSAGE_TOPICS.share,
      arguments: shareOptions,
    });
  }

  collapseConductor() {
    const { facebookConductor } = this.props;
    facebookConductor.style.width = '1px';
    facebookConductor.style.height = '1px';
  }

  expandConductor() {
    const { facebookConductor } = this.props;
    facebookConductor.style.width = '100%';
    facebookConductor.style.height = '100%';
    facebookConductor.style.zIndex = '9999999999';
    facebookConductor.style.position = 'fixed';
    facebookConductor.style.top = 0;
    facebookConductor.style.left = 0;
  }

  render() {
    const { api, className, project } = this.props;
    const {
      isLoading,
      loadingMessage,
      currentStage,
      embedLocation,
      preload,
      autoplay,
      embedPage,
      facebookPages,
      selectedFbPage,
      facebookPageTab,
      facebookUserData,
      facebookPostData,
    } = this.state;

    return (
      <Fragment>
        <div className={`social-campaign ${className}`}>
          <div className={`loading-screen workspace ${!isLoading ? 'hidden' : ''}`}>
            <InfiniteLoading />
            <span>{loadingMessage}</span>
          </div>
          <div className={`workspace ${isLoading ? 'hidden' : ''}`}>
            <Progress
              className="embed-progress"
              value={currentStage.completionPercentage}
            />
            <div className={`embed-engine ${currentStage.key !== 'embed-engine' && 'hidden'}`}>
              <h5 className="embed-title">Where do you want to embed your video?</h5>
              <div className="embed-grid">
                <div className="row embed-group">
                  <label className="cell" htmlFor="embed-location-select">Embed Location</label>
                  <select
                    className="cell"
                    name="select"
                    id="embed-location-select"
                    value={embedLocation.key}
                    onChange={({ target: { value } }) => this.setState({
                      embedLocation: EMBED_LOCATIONS.find(item => item.key === value),
                    })}
                  >
                    {EMBED_LOCATIONS.map(
                      ({ key, label }, idx) => <option key={idx} value={key}>{label}</option>,
                    )}
                  </select>
                </div>
                <div className="row embed-group">
                  <label className="cell" htmlFor="preload-check">
                    Preload
                  </label>
                  <Input
                    className="cell"
                    type="checkbox"
                    id="preload-check"
                    checked={preload}
                    onChange={({ target: { checked } }) => this.setState({ preload: checked })}
                  />
                </div>
                <div className="row embed-group">
                  <label className="cell" htmlFor="autoplay-check">
                    Autoplay
                  </label>
                  <Input
                    className="cell"
                    type="checkbox"
                    id="autoplay-check"
                    checked={autoplay}
                    onChange={({ target: { checked } }) => this.setState({ autoplay: checked })}
                  />
                </div>
              </div>
              <div className={embedLocation.embedGenerator ? 'embed-details' : 'hidden'}>
                <span className="embed-line">{embedLocation.prompt}</span>
                <EmbedDataContainer
                  className="embed-item"
                  url={[
                    project.make.url, [
                      autoplay ? 'autoplay=true' : null,
                      !preload ? 'preload=none' : null,
                    ].filter(item => !!item).join('&')]
                    .join('?')}
                  stringGenerator={embedLocation.embedGenerator}
                  resizable
                />
              </div>
            </div>
            <div className={`embed-location ${currentStage.key !== 'embed-location' && 'hidden'}`}>
              <h5 className="embed-title">URL Link to your page with your embedded video</h5>
              <Input
                type="text"
                className="embed-page-input"
                value={embedPage}
                onChange={({ target: { value } }) => this.setState({ embedPage: value })}
              />
            </div>
            <div className={`facebook-login ${currentStage.key !== 'facebook-login' && 'hidden'}`}>
              <div className="login-note">
                <label>
                  You must login to Facebook and authorize our app to post Videos into Facebook Pages
                </label>
              </div>
              <button
                className="go-button fb-login"
                onClick={() => {
                  this.postFacebookMessage({
                    topic: this.constructor.FACEBOOK_MESSAGE_TOPICS.logIn,
                    arguments: FACEBOOK_PERMISSIONS,
                  });
                }}
              >
                <i className="fa fa-facebook-official" />
                Log in
              </button>
            </div>
            <div className={`facebook-page ${currentStage.key !== 'facebook-page' && 'hidden'}`}>
              <h5 className="embed-title">
                Which one of your Facebook Pages do you want to embed your Video into?
              </h5>
              <div className="embed-grid">
                <div className="row embed-group">
                  <label className="cell" htmlFor="facebook-page-select">
                    Facebook pages
                  </label>
                  <select
                    id="facebook-page-select"
                    className="cell"
                    name="select"
                    value={selectedFbPage}
                    onChange={({ target: { value } }) => {
                      const fbPage = facebookPages.find(page => page.id === value);
                      this.setState({
                        selectedFbPage: value,
                      });
                      this.postFacebookMessage({
                        topic: this.constructor.FACEBOOK_MESSAGE_TOPICS.getPageTabs,
                        arguments: {
                          pageId: fbPage.id,
                          pageAccessToken: fbPage.token,
                        },
                      });
                    }}
                  >
                    {facebookPages.map(
                      ({ id, name }, idx) => <option key={idx} value={id}>{name}</option>,
                    )}
                  </select>
                </div>
                <div className="row embed-group">
                  <label className="cell" htmlFor="facebook-page-tab-input">
                    Facebook Page tab name
                  </label>
                  <Input
                    id="facebook-page-tab-input"
                    className="cell facebook-page-tab"
                    type="text"
                    value={facebookPageTab}
                    onChange={({ target: { value } }) =>
                      this.setState({ facebookPageTab: { name: value } })}
                  />
                </div>
              </div>
            </div>
            <div className={`facebook-post ${currentStage.key !== 'facebook-post' && 'hidden'}`}>
              <h5 className="embed-title">
                What do you want the Facebook Share to look like?
              </h5>
              <div className="embed-grid">
                <div className="row embed-group">
                  <div className="embed-grid cell facebook-post-details">
                    <div className="row embed-group">
                      <label className="cell" htmlFor="facebook-post-url-input">
                        Shared Url
                      </label>
                      <Input
                        id="facebook-post-url-input"
                        className="cell facebook-post-input"
                        type="text"
                        value={facebookPostData.link}
                        onChange={({ target: { value } }) => {
                          const { facebookPostData } = this.state;
                          facebookPostData.link = value;
                          this.setState({ facebookPostData });
                        }}
                      />
                    </div>
                    <div className="row embed-group">
                      <label className="cell" htmlFor="facebook-post-title-input">
                        Post Title
                      </label>
                      <Input
                        id="facebook-post-title-input"
                        className="cell facebook-post-input"
                        type="text"
                        value={facebookPostData.title}
                        onChange={({ target: { value } }) => {
                          const { facebookPostData } = this.state;
                          facebookPostData.title = value;
                          this.setState({ facebookPostData });
                        }}
                      />
                    </div>
                    <div className="row embed-group">
                      <label className="cell" htmlFor="facebook-post-description-input">
                        Post Description
                      </label>
                      <Input
                        id="facebook-post-description-input"
                        className="cell facebook-post-input"
                        type="text"
                        value={facebookPostData.description}
                        onChange={({ target: { value } }) => {
                          const { facebookPostData } = this.state;
                          facebookPostData.description = value;
                          this.setState({ facebookPostData });
                        }}
                      />
                    </div>
                    <div className="row embed-group">
                      <label className="cell" htmlFor="facebook-post-image-input">
                        Post Image
                      </label>
                      <Input
                        id="facebook-post-image-input"
                        className="cell facebook-post-input"
                        type="file"
                        onChange={async ({ target: { files: [file] } }) => {
                          const response = await api.uploadMedia(file);
                          const { facebookPostData } = this.state;
                          facebookPostData.thumbnail = response.url;
                          this.setState({ facebookPostData });
                        }}
                      />
                    </div>
                  </div>
                  <FacebookPostPreview
                    className="cell"
                    user={facebookUserData}
                    post={facebookPostData}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="controls">
            <button
              className={`go-button back ${currentStage.key === this.constructor.STAGES[0].key ? 'hidden' : ''}`}
              onClick={() => {
                if (isLoading) {
                  return;
                }
                this.prevStage();
              }}
            >
              Back
            </button>
            <button
              className={
                `go-button ${currentStage.key === this.constructor.STAGES[this.constructor.STAGES.length - 1].key ?
                  'next fb-login' :
                  'next'}`
              }
              onClick={() => {
                if (isLoading) {
                  return;
                }
                if (currentStage.key ===
                  this.constructor.STAGES[this.constructor.STAGES.length - 1].key) {
                  this.sharePost();
                } else {
                  this.nextStage();
                }
              }}
            >
              <i
                className={`${currentStage.key === this.constructor.STAGES[this.constructor.STAGES.length - 1].key ?
                  'fa fa-facebook-official' :
                  'hidden'}`}
              />
              {currentStage.key === this.constructor.STAGES[this.constructor.STAGES.length - 1].key ? 'Share' : 'Next'}
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}
