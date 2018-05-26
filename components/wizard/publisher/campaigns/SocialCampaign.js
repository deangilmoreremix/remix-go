import React, { Component, Fragment } from 'react';
import { Progress, Input } from 'reactstrap';

import Project from '../../../../lib/editor/Project';
import PropTypes from '../../../../lib/PropTypes';
import EmbedDataContainer from '../EmbedDataContainer';
import FacebookPostPreview from './FacebookPostPreview';

const FB_APP_ID = '1728968890675795';
const FACEBOOK_PERMISSIONS = 'manage_pages,pages_show_list';
const FB_DEFAULT_USERPIC = 'http://emblemsbf.com/img/11864.jpg';

const FACEBOOK_MESSAGE_TOPICS = {
  logIn: 'LOG_IN',
  settleAuth: 'SETTLE_AUTH',
  init: 'INIT',
  fetchUserData: 'FETCH_USER_DATA',
  fetchPagesData: 'FETCH_PAGE_DATA',
  getPageTabs: 'GET_PAGE_TABS',
  createTab: 'CREATE_TAB',
  share: 'SHARE',
};

const STAGES = [
  { key: 'embed-engine', completionPercentage: 25 },
  { key: 'embed-location', completionPercentage: 25 },
  {
    key: 'facebook-login',
    completionPercentage: 50,
    bootstrap: (instance) => {
      instance.postFacebookMessage({ topic: FACEBOOK_MESSAGE_TOPICS.init, arguments: FB_APP_ID });
    },
  },
  {
    key: 'facebook-page',
    completionPercentage: 50,
    bootstrap: (instance) => {
      instance.postFacebookMessage({ topic: FACEBOOK_MESSAGE_TOPICS.fetchPagesData });
    },
  },
  {
    key: 'facebook-post',
    completionPercentage: 75,
    bootstrap: (instance) => {
      const { project } = instance.props;
      instance.setState({
        facebookPostData: {
          title: project.name,
          thumbnail: project.thumbnail,
          description: project.description,
          link: project.make.url,
        },
      });
      instance.postFacebookMessage({ topic: FACEBOOK_MESSAGE_TOPICS.fetchUserData });
    },
  },
];

const EMBED_LOCATIONS = [
  {
    key: 'default',
    label: 'Direct (Default Hosting)',
  },
  {
    key: 'leadpages',
    label: 'LeadPages',
    prompt: 'Copy and paste this embed code into your LeadPage',
    embedGenerator: (url, width, height) => `<script>var vars={};var tempstring='';var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value){if(value){tempstring+=key+'='+value+'&';}});if (tempstring) {document.addEventListener('DOMContentLoaded',function() {document.getElementById('vr').src='${url}?'+tempstring.slice(0, -1);});}</script>\n\n<iframe id='vr' src='${url}' width='${width}' height='${height}' frameborder='0' mozallowfullscreen webkitallowfullscreen allowfullscreen></iframe>`,
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
    embedGenerator: (url, width, height) => `<script>var vars={};var tempstring='';var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value){if(value){tempstring+=key+'='+value+'&';}});if (tempstring) {document.addEventListener('DOMContentLoaded',function() {document.getElementById('vr').src='${url}?'+tempstring.slice(0, -1);});}</script>\n\n<iframe id='vr' src='${url}' width='${width}' height='${height}' frameborder='0' mozallowfullscreen webkitallowfullscreen allowfullscreen></iframe>`,
  },
  {
    key: 'facebook-page',
    label: 'Facebook Page',
  },
  {
    key: 'other',
    label: 'Other',
    prompt: 'Copy & Paste this embed code inside the custom HTML element',
    embedGenerator: (url, width, height) => `<script>var vars={};var tempstring='';var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value){if(value){tempstring+=key+'='+value+'&';}});if (tempstring) {document.addEventListener('DOMContentLoaded',function() {document.getElementById('vr').src='${url}?'+tempstring.slice(0, -1);});}</script>\n\n<iframe id='vr' src='${url}' width='${width}' height='${height}' frameborder='0' mozallowfullscreen webkitallowfullscreen allowfullscreen></iframe>`,
  },
];

export default class SocialCampaign extends Component {
  static propTypes = {
    className: PropTypes.string,
    project: PropTypes.instanceOf(Project).isRequired,
    onCampaignFinished: PropTypes.func,
  };

  state = {
    currentStage: STAGES[0],
    embedLocation: EMBED_LOCATIONS[0],
    preload: true,
    autoplay: false,
    embedPage: '',
    facebookPages: [],
    selectedFbPage: '',
    facebookPageTab: '',
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
    const currentStage = STAGES.find(item => item.key === stageName);
    this.setState({ currentStage });
    currentStage.bootstrap(this);
    if (currentStage.bootstrap) {
      currentStage.bootstrap(this);
    }
  }

  facebookMessageHandlers = {
    [FACEBOOK_MESSAGE_TOPICS.settleAuth]: (data) => {
      const err = data.error;
      // hideLoading();
      if (err) {
        return this.setStage('facebook-login');
      }
      if (data.loggedIn) {
        return this.nextStage();
      }
      return this.setStage('facebook-login');
    },
    [FACEBOOK_MESSAGE_TOPICS.init]: () => {
      this.postFacebookMessage({
        topic: FACEBOOK_MESSAGE_TOPICS.settleAuth,
        arguments: FACEBOOK_PERMISSIONS,
      });
    },
    [FACEBOOK_MESSAGE_TOPICS.fetchPagesData]: (data) => {
      const { error, result } = data;
      const facebookPages = [];
      if (error) {
        // return showError(err.message);
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
    [FACEBOOK_MESSAGE_TOPICS.getPageTabs]: (data) => {
      const { error, result } = data;
      if (error) {
        // showError(err.message);
        return;
      }

      result.data.forEach((tab) => {
        const tabAppId = tab.application && tab.application.id;
        if (tabAppId === FB_APP_ID) {
          this.setState({
            facebookPageTab: tab.name,
          });
        }
      });
    },
    [FACEBOOK_MESSAGE_TOPICS.fetchUserData]: (data) => {
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
  };

  nextStage() {
    const { embedLocation } = this.state;
    let { currentStage } = this.state;
    let nextStageIdx = Math.min(
      STAGES.findIndex(item => currentStage.key === item.key) + 1,
      STAGES.length - 1,
    );
    if (STAGES[nextStageIdx].key === 'embed-location' &&
      ['default', 'facebook-page'].indexOf(embedLocation.key) !== -1) {
      nextStageIdx += 1;
    }
    if (STAGES[nextStageIdx].key === 'facebook-page' && embedLocation.key !== 'facebook-page') {
      nextStageIdx += 1;
    }
    currentStage = STAGES[nextStageIdx];
    this.setState({ currentStage });
    if (currentStage.bootstrap) {
      currentStage.bootstrap(this);
    }
  }

  postFacebookMessage(data) {
    const { facebookConductor } = this;
    facebookConductor.contentWindow.postMessage({
      topic: data.topic,
      arguments: data.arguments,
    }, facebookConductor.src);
  }

  prevStage() {
    const { embedLocation } = this.state;
    let { currentStage } = this.state;
    let prevStageIdx = Math.min(
      STAGES.findIndex(item => currentStage.key === item.key) - 1,
      0,
    );
    if (STAGES[prevStageIdx].key === 'embed-location' && embedLocation.key === 'default') {
      prevStageIdx -= 1;
    }
    currentStage = STAGES[prevStageIdx];
    this.setState({ currentStage });
  }

  receiveFacebookMessage(e) {
    const { topic } = e.data;

    if (this.facebookMessageHandlers[topic]) {
      this.facebookMessageHandlers[topic](e.data);
    }
  }

  sharePost() {
    this.postFacebookMessage({ topic: FACEBOOK_MESSAGE_TOPICS.share, arguments: {} });
  }

  render() {
    const { className, project, onCampaignFinished } = this.props;
    const {
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
          <iframe
            title="Facebook conductor"
            src="https://cdn.vidcloud.io/social-campaign/social-campaign.html"
            frameBorder="0"
            className="conductor-iframe"
            id="conductor-iframe"
            ref={(c) => { this.facebookConductor = c; }}
            onLoad={() => {
              this.facebookConductor.contentWindow.postMessage({
                topic: 'Initial load',
                config: {},
                topics: FACEBOOK_MESSAGE_TOPICS,
                parentWindowUrl: window.location.origin + window.location.pathname,
              }, this.facebookConductor.src);
            }}
          />
          <div className="workspace">
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
                {
                  embedLocation.key === 'wordpress' ?
                    <span className="embed-line">
                      Click here to install the <a href="https://cdn.vidcloud.io/wp/vr.zip">wp</a> plugin.
                    </span> :
                    null
                }
                <span className="embed-line">{embedLocation.prompt}</span>
                <EmbedDataContainer
                  className="embed-item"
                  url={project.make.url}
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
                    topic: FACEBOOK_MESSAGE_TOPICS.logIn,
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
                        topic: FACEBOOK_MESSAGE_TOPICS.getPageTabs,
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
                    onChange={({ target: { value } }) => this.setState({ facebookPageTab: value })}
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
              className={`go-button back ${currentStage.key === STAGES[0].key ? 'hidden' : ''}`}
              onClick={() => this.prevStage()}
            >
              Back
            </button>
            <button
              className={
                `go-button ${currentStage.key === STAGES[STAGES.length - 1].key ?
                  'next fb-login' :
                  'next'}`
              }
              onClick={() => {
                if (currentStage.key === STAGES[STAGES.length - 1].key) {
                  onCampaignFinished();
                } else {
                  this.nextStage();
                }
              }}
            >
              <i
                className={`${currentStage.key === STAGES[STAGES.length - 1].key ?
                  'fa fa-facebook-official' :
                  'hidden'}`}
              />
              {currentStage.key === STAGES[STAGES.length - 1].key ? 'Share' : 'Next'}
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}
