import React, { Component, Fragment } from 'react';
import { Progress } from 'reactstrap';

import Project from '../../../../lib/editor/Project';
import PropTypes from '../../../../lib/PropTypes';
import EmbedDataContainer from '../EmbedDataContainer';

const STAGES = [
  { key: 'embed-engine' },
  { key: 'embed-location' },
  { key: 'service-provider' },
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
    key: 'other',
    label: 'Other',
    prompt: 'Copy & Paste this embed code inside the custom HTML element',
    embedGenerator: (url, width, height) => `<script>var vars={};var tempstring='';var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value){if(value){tempstring+=key+'='+value+'&';}});if (tempstring) {document.addEventListener('DOMContentLoaded',function() {document.getElementById('vr').src='${url}?'+tempstring.slice(0, -1);});}</script>\n\n<iframe id='vr' src='${url}' width='${width}' height='${height}' frameborder='0' mozallowfullscreen webkitallowfullscreen allowfullscreen></iframe>`,
  },
];

const EMAIL_PROVIDERS = [
  {
    key: 'aweber',
    label: 'AWeber',
    image: '../../../../static/images/publisher/email-campaign/aweber_hover.png',
    paramsBuilder: () => {},
  },
  {
    key: 'mailchimp',
    label: 'MailChimp',
    image: '../../../../static/images/publisher/email-campaign/mailchimp_hover.png',
    paramsBuilder: () => {},
  },
  {
    key: 'interspire',
    label: 'Interspire',
    image: '../../../../static/images/publisher/email-campaign/interspire_hover.png',
    paramsBuilder: () => {},
  },
  {
    key: 'getresponse',
    label: 'GetResponse',
    image: '../../../../static/images/publisher/email-campaign/gr_hover.png',
    paramsBuilder: () => {},
  },
  {
    key: 'infusionsoft',
    label: 'InfusionSoft',
    image: '../../../../static/images/publisher/email-campaign/infusionsoft_hover.png',
    paramsBuilder: () => {},
  },
  {
    key: 'sendlane',
    label: 'Sendlane',
    image: '../../../../static/images/publisher/email-campaign/sendlane_hover.png',
    paramsBuilder: () => {},
  },
  {
    key: 'constantcontact',
    label: 'Constant Contact',
    image: '../../../../static/images/publisher/email-campaign/constantcontact_hover.png',
    paramsBuilder: () => {},
  },
  {
    key: 'sendreach',
    label: 'SendReach',
    image: '../../../../static/images/publisher/email-campaign/sendreach_hover.png',
    paramsBuilder: () => {},
  },
];

export default class EmailCampaign extends Component {
  static propTypes = {
    className: PropTypes.string,
    project: PropTypes.string.isRequired,
    onCampaignFinished: PropTypes.func,
  };

  state = {
    currentStage: STAGES[0],
    embedLocation: EMBED_LOCATIONS[0],
    preload: true,
    autoplay: false,
    embedPage: '',
    emailProvider: null,
    personalizedLink: '',
  };

  nextStage() {
    const { currentStage, embedLocation } = this.state;
    let nextStageIdx = Math.min(
      STAGES.findIndex(item => currentStage.key === item.key) + 1,
      STAGES.length - 1,
    );
    if (STAGES[nextStageIdx].key === 'embed-location' && embedLocation.key === 'default') {
      nextStageIdx += 1;
    }
    this.setState({ currentStage: STAGES[nextStageIdx] });
  }

  prevStage() {
    const { currentStage, embedLocation } = this.state;
    let prevStageIdx = Math.min(
      STAGES.findIndex(item => currentStage.key === item.key) - 1,
      0,
    );
    if (STAGES[prevStageIdx].key === 'embed-location' && embedLocation.key === 'default') {
      prevStageIdx -= 1;
    }
    this.setState({ currentStage: STAGES[prevStageIdx] });
  }

  render() {
    const { className, project, onCampaignFinished } = this.props;
    const {
      currentStage,
      embedLocation,
      preload,
      autoplay,
      embedPage,
      emailProvider,
      personalizedLink,
    } = this.state;

    return (
      <Fragment>
        <div className={`email-campaign ${className}`}>
          <div className="workspace">
            <Progress
              className="embed-progress"
              value={((STAGES.findIndex(
                item => currentStage.key === item.key) + 1
              ) / STAGES.length) * 100}
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
                  <input
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
                  <input
                    className="cell"
                    type="checkbox"
                    id="autoplay-check"
                    checked={autoplay}
                    onChange={({ target: { checked } }) => this.setState({ autoplay: checked })}
                  />
                </div>
              </div>
              <div className={embedLocation.key === 'default' ? 'hidden' : 'embed-details'}>
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
                  url={project}
                  stringGenerator={embedLocation.embedGenerator}
                  resizable
                />
              </div>
            </div>
            <div className={`embed-location ${currentStage.key !== 'embed-location' && 'hidden'}`}>
              <h5 className="embed-title">URL Link to your page with your embedded video</h5>
              <input
                type="text"
                className="embed-page-input"
                value={embedPage}
                onChange={({ target: { value } }) => this.setState({ embedPage: value })}
              />
            </div>
            <div className={`service-provider ${currentStage.key !== 'service-provider' && 'hidden'}`}>
              <ul className="service-provider-inner">
                <li className="service-provider-step">
                  <span>Select your Email Service Provider</span>
                  <ul className="providers-list">
                    {EMAIL_PROVIDERS.map((item, idx) => (
                      <li
                        className={`provider-item ${emailProvider && emailProvider.key === item.key && 'selected'}`}
                        key={idx}
                        onClick={() => this.setState({ emailProvider: item })}
                      >
                        <img src={item.image} alt={item.label} />
                      </li>
                    ))}
                  </ul>
                </li>
                <li className={`service-provider-step ${!emailProvider ? 'hidden' : ''}`}>
                  <span>Copy & Paste this PersonalizedLink™ into your email campaign</span>
                  <input className="personalized-link" type="text" value={personalizedLink} readOnly />
                </li>
                <li className={`service-provider-step ${!emailProvider ? 'hidden' : ''}`}>
                  <span>Send your Personalized email campaign</span>
                </li>
              </ul>
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
