import React, { Component, Fragment } from 'react';
import { Progress, Input } from 'reactstrap';

import Project from '../../../../lib/editor/Project';
import PropTypes from '../../../../lib/PropTypes';
import EmbedDataContainer from '../EmbedDataContainer';

const FB_APP_ID = '1728968890675795';
const FACEBOOK_PERMISSIONS = 'manage_pages,pages_show_list';

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
  { key: 'facebook-page', completionPercentage: 50 },
  { key: 'facebook-post', completionPercentage: 75 },
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
    key: 'fb-page',
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
    [`${FACEBOOK_MESSAGE_TOPICS.settleAuth}`]: (data) => {
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
    [`${FACEBOOK_MESSAGE_TOPICS.init}`]: () => {
      this.postFacebookMessage({
        topic: FACEBOOK_MESSAGE_TOPICS.settleAuth,
        arguments: FACEBOOK_PERMISSIONS,
      });
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
      embedLocation.key === 'default') {
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

  render() {
    const { className, project, onCampaignFinished } = this.props;
    const {
      currentStage,
      embedLocation,
      preload,
      autoplay,
      embedPage,
    } = this.state;

    return (
      <Fragment>
        <div className={`social-campaign ${className}`}>
          <iframe
            title="Facebook conductor"
            src="https://dev-cdn.vidcloud.io/social-campaign/social-campaign.html"
            frameBorder="0"
            className="conductor-iframe"
            id="conductor-iframe"
            ref={(c) => { this.facebookConductor = c; }}
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
              <a
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
              </a>
              <div className="cleared" />
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
              className="go-button next"
              onClick={() => {
                if (currentStage.key === STAGES[STAGES.length - 1].key) {
                  onCampaignFinished();
                } else {
                  this.nextStage();
                }
              }}
            >
              {currentStage.key === STAGES[STAGES.length - 1].key ? 'Done' : 'Next'}
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}
