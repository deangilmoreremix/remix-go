import React, { Component, Fragment } from 'react';
import { Progress, Input } from 'reactstrap';
import ReactTooltip from 'react-tooltip';

import Project from '../../../../lib/editor/Project';
import PropTypes from '../../../../lib/PropTypes';
import EmbedDataContainer from '../EmbedDataContainer';

const SKIP_VARS = [
  'GEOCOUNTRY',
  'GEOCITY',
  'GEOSTATE',
];

const STAGES = [
  { key: 'embed-engine', completionPercentage: (1 / 3.0) * 100 },
  { key: 'embed-location', completionPercentage: (2 / 3.0) * 100 },
  { key: 'service-provider', completionPercentage: 100 },
];

const iframeStyling = `<!--- embed styling ---->
<style> 
  .iframe-container { position:relative; padding-bottom:56.25%; padding-top:30px; height:0; overflow:hidden; border:1px solid #ccc; }
  .iframe-container iframe,.iframe-container object,.iframe-container embed { position:absolute; top:0; left:0; width:100%; height:100%; }
</style>
<!--- End of embed styling ---->
`;
const embedScript = url => `<script>var vars={};var tempstring='';var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value){if(value){tempstring+=key+'='+value+'&';}});if (tempstring) {document.addEventListener('DOMContentLoaded',function() {document.getElementById('vr').src='${url}?'+tempstring.slice(0, -1);});}</script>\n\n`;
const iframeTag = (url, width, height) => `<div class="iframe-container"><iframe id='vr' src='${url}' width='${width}' height='${height}' frameborder='0' allow="autoplay; fullscreen" mozallowfullscreen webkitallowfullscreen allowfullscreen></iframe></div>`;

const EMBED_LOCATIONS = [
  {
    key: 'default',
    label: 'Direct (Default Hosting)',
  },
  {
    key: 'leadpages',
    label: 'LeadPages',
    prompt: 'Copy and paste this embed code into your LeadPage',
    embedGenerator: (url, width, height) => `${embedScript(url)}${iframeStyling}${iframeTag(url, width, height)}`,
  },
  {
    key: 'wordpress',
    label: 'WordPress',
    prompt: 'Copy and paste this embed code into your WordPress',
    embedGenerator: (url, width, height) => `${iframeStyling}${iframeTag(url, width, height)}`,
  },
  {
    key: 'optimizepress',
    label: 'OptimizePress 2.0',
    prompt: 'Copy and paste this embed code into your Video Player OP 2.0 element',
    embedGenerator: (url, width, height) => `${embedScript(url)}${iframeStyling}${iframeTag(url, width, height)}`,
  },
  {
    key: 'other',
    label: 'Other',
    prompt: 'Copy & Paste this embed code inside the custom HTML element',
    embedGenerator: (url, width, height) => `${embedScript(url)}${iframeStyling}${iframeTag(url, width, height)}`,
  },
];

const duplicateCustomVars = (string, variable) => (
  string.split('&').map(keyPair => [keyPair.split('=')]).indexOf(variable) === -1
);

const EMAIL_PROVIDERS = [
  {
    key: 'aweber',
    label: 'AWeber',
    image: '../../../../static/images/publisher/email-campaign/aweber_hover.png',
    paramsBuilder: (personalizations) => {
      let result = '';
      const lookup = {
        GEOCOUNTRY: 'geog_country',
        IMAGE: 'custom image',
      };
      personalizations.forEach((personalization) => {
        const tempvar = lookup[personalization] || personalization.toLowerCase();
        if (duplicateCustomVars(result, personalization)) {
          result = `${result + personalization}={!${tempvar}}&`;
        }
      });
      return result.slice(0, -1);
    },
  },
  {
    key: 'mailchimp',
    label: 'MailChimp',
    image: '../../../../static/images/publisher/email-campaign/mailchimp_hover.png',
    paramsBuilder: (personalizations) => {
      let result = '';
      const lookup = {
        LASTNAME: 'LNAME',
        FIRSTNAME: 'FNAME',
        GEOCOUNTRY: 'Everywhere',
        IMAGE: 'IMAGE',
      };
      personalizations.forEach((personalization) => {
        const tempVar = lookup[personalization] || personalization;
        if (duplicateCustomVars(result, personalization)) {
          result = result + personalization + (result !== 'Everywhere' ? `=*|${tempVar}|*&` : `=${tempVar}&`);
        }
      });
      return result.slice(0, -1);
    },
  },
  {
    key: 'interspire',
    label: 'Interspire',
    image: '../../../../static/images/publisher/email-campaign/interspire_hover.png',
    paramsBuilder: (personalizations) => {
      let result = '';
      const lookup = {
        LASTNAME: 'Last Name',
        FIRSTNAME: 'First Name',
        EMAIL: 'emailaddress',
        GEOCOUNTRY: 'Everywhere',
        IMAGE: 'image',
      };
      personalizations.forEach((personalization) => {
        const tempvar = lookup[personalization]
          || personalization.charAt(0).toUpperCase() + personalization.slice(1).toLowerCase();
        if (duplicateCustomVars(result, personalization)) {
          result = result + personalization + (tempvar !== 'Everywhere' ? `=%%${tempvar}%%&` : '=Everywhere&');
        }
      });
      return result.slice(0, -1);
    },
  },
  {
    key: 'getresponse',
    label: 'GetResponse',
    image: '../../../../static/images/publisher/email-campaign/gr_hover.png',
    paramsBuilder: (personalizations) => {
      let result = '';
      const lookup = {
        GEOCOUNTRY: 'geo country',
      };
      personalizations.forEach((personalization) => {
        const tempvar = lookup[personalization] || personalization.toLowerCase();
        if (duplicateCustomVars(result, personalization)) {
          result = `${result + personalization}=[[${tempvar}]]&`;
        }
      });
      return result.slice(0, -1);
    },
  },
  {
    key: 'infusionsoft',
    label: 'InfusionSoft',
    image: '../../../../static/images/publisher/email-campaign/infusionsoft_hover.png',
    paramsBuilder: (personalizations) => {
      let result = '';
      const lookup = {
        LASTNAME: 'Contact.LastName',
        FIRSTNAME: 'Contact.FirstName',
        EMAIL: 'Contact.Email',
        GEOCOUNTRY: 'Contact.Country',
        IMAGE: 'Contact.Image',
      };
      personalizations.forEach((personalization) => {
        const tempvar = lookup[personalization]
          || personalization.charAt(0).toUpperCase() + personalization.slice(1).toLowerCase();
        if (duplicateCustomVars(result, personalization)) {
          result = `${result + personalization}=~${tempvar}~&`;
        }
      });
      return result.slice(0, -1);
    },
  },
  {
    key: 'sendlane',
    label: 'Sendlane',
    image: '../../../../static/images/publisher/email-campaign/sendlane_hover.png',
    paramsBuilder: (personalizations) => {
      let result = '';
      const lookup = {
        LASTNAME: 'VAR_LAST_NAME',
        FIRSTNAME: 'VAR_FIRST_NAME',
        EMAIL: 'VAR_EMAIL',
        GEOCOUNTRY: 'VAR_COUNTRY',
        IMAGE: 'VAR_IMAGE',
      };
      personalizations.forEach((personalization) => {
        const tempvar = lookup[personalization] || personalization.toUpperCase();
        if (duplicateCustomVars(result, personalization)) {
          result = `${result + personalization}=${tempvar}&`;
        }
      });
      return result.slice(0, -1);
    },
  },
  {
    key: 'constantcontact',
    label: 'Constant Contact',
    image: '../../../../static/images/publisher/email-campaign/constantcontact_hover.png',
    paramsBuilder: (personalizations) => {
      let result = '';
      const lookup = {
        LASTNAME: '$Subscriber.Lastname',
        FIRSTNAME: '$Subscriber.Firstname',
        EMAIL: '$Subscriber.Email',
        GEOCOUNTRY: '$Subscriber.Country',
        IMAGE: '$Subscriber.Image',
      };
      personalizations.forEach((personalization) => {
        const tempvar = lookup[personalization] || `$Subscriber.${personalization.charAt(0).toUpperCase()}${personalization.toLowerCase().slice(1)}`;
        if (duplicateCustomVars(result, personalization)) {
          result = `${result + personalization}={!${tempvar}}&`;
        }
      });
      return result.slice(0, -1);
    },
  },
  {
    key: 'sendreach',
    label: 'SendReach',
    image: '../../../../static/images/publisher/email-campaign/sendreach_hover.png',
    paramsBuilder: (personalizations) => {
      const lookup = {
        LASTNAME: 'LNAME',
        FIRSTNAME: 'FNAME',
        EMAIL: 'EMAIL',
        GEOCITY: 'CITY',
        GEOCOUNTRY: 'COUNTRY',
        GEOSTATE: 'STATE',
        GENDER: 'GENDER',
      };

      let result = '';

      personalizations.forEach((personalization) => {
        const tempvar = lookup[personalization] || personalization;
        if (duplicateCustomVars(result, personalization)) {
          result = `${result + personalization}=[${tempvar}]&`;
        }
      });
      return result.slice(0, -1);
    },
  },
  {
    key: 'custom',
    label: 'Custom',
    image: '../../../../static/images/publisher/email-campaign/custom_hover.png',
    paramsBuilder: (personalizations) => {
      let result = '';
      const lookup = {
        LASTNAME: 'lastname_token',
        FIRSTNAME: 'firstname_token',
        EMAIL: 'email_token',
        GEOCOUNTRY: 'country_token',
        IMAGE: 'image_token',
      };
      personalizations.forEach((personalization) => {
        const tempvar = lookup[personalization] || `${personalization.toLowerCase()}_token`;
        if (duplicateCustomVars(result, personalization)) {
          result = `${result + personalization}=${tempvar}&`;
        }
      });
      return result.slice(0, -1);
    },
  },
];

export default class EmailCampaign extends Component {
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
    emailProvider: null,
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

  generatePersonalizedLink() {
    const { project } = this.props;
    let { project: { personalizations } } = this.props;
    const { autoplay, preload, embedLocation, emailProvider, embedPage } = this.state;
    const basicPath = embedLocation.key === 'default' ? project.make.url : embedPage;
    personalizations = personalizations.filter(item => SKIP_VARS.indexOf(item) === -1);
    const providerParams = (emailProvider && emailProvider.paramsBuilder)
      ? emailProvider.paramsBuilder(personalizations)
      : '';
    return [
      basicPath, [
        autoplay ? 'autoplay=1' : null,
        !preload ? 'preload=none' : null,
        providerParams,
      ].filter(item => !!item).join('&'),
    ].join('?');
  }

  canBypassStage(stage) {
    const {
      isLoading,
      embedPage,
      emailProvider,
    } = this.state;
    if (isLoading) {
      return false;
    }
    switch (stage.key) {
      case 'embed-engine':
        return true;
      case 'embed-location':
        return embedPage && embedPage.length > 0;
      case 'service-provider':
        return emailProvider;
      default:
        return false;
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
      emailProvider,
    } = this.state;

    return (
      <Fragment>
        <div className={`email-campaign ${className}`}>
          <ReactTooltip
            effect="solid"
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
              {
                autoplay
                && (
                  <div className="embed-group warning">
                    <strong>Warning! </strong>
                    Please note that due to new autoplay policy changes in browsers, autoplay can
                    start only with muted video and then can be unmuted by explicit user interaction
                  </div>
                )
              }
              <div className={embedLocation.key === 'default' ? 'hidden' : 'embed-details'}>
                {
                  embedLocation.key === 'wordpress'
                    ? (
                      <span className="embed-line">
                      Click here to install the
                        <a href="https://cdn.vidcloud.io/wp/vr.zip">wp</a>
                        plugin.
                      </span>
                    )
                    : null
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
                        data-tip={item.label}
                      >
                        <img src={item.image} alt={item.label} />
                      </li>
                    ))}
                  </ul>
                </li>
                <li className={`service-provider-step ${!emailProvider ? 'hidden' : ''}`}>
                  <span>Copy & Paste this PersonalizedLink™ into your email campaign</span>
                  <Input
                    className="personalized-link"
                    type="text"
                    value={this.generatePersonalizedLink()}
                    readOnly
                    onClick={({ target }) => { target.select(); }}
                  />
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
              className={`go-button next ${this.canBypassStage(currentStage) ? '' : 'inactive'}`}
              onClick={() => {
                if (!this.canBypassStage(currentStage)) {
                  return;
                }
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
