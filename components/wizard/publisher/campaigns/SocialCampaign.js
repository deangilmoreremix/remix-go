import React, { Component, Fragment } from 'react';
import { Progress, Input } from 'reactstrap';
import { inject, observer } from 'mobx-react';

import Project from '../../../../lib/editor/Project';
import PropTypes from '../../../../lib/PropTypes';
import EmbedDataContainer from '../EmbedDataContainer';
import InfiniteLoading from '../../../common/InfiniteLoading';

import FacebookSocialProvider from '../../../../lib/social-providers/FacebookSocialProvider';

const FB_APP_ID = '1728968890675795';
const BACKEND_URL = 'https://api.videoremix.io';
const MIN_FANS_PAGE = 2000;

const iframeStyling = `<!--- VideoRemix embed styling ---->
<style> 
  .iframe-container { position:relative; padding-bottom:56.25%; padding-top:30px; height:0; overflow:hidden; border:1px solid #ccc; }
  .iframe-container iframe,.iframe-container object,.iframe-container embed { position:absolute; top:0; left:0; width:100%; height:100%; }
</style>
<!--- End of VideoRemix embed styling ---->
`;

const EMBED_LOCATIONS = [
  {
    key: 'default',
    label: 'Direct (Default Hosting)',
  },
  {
    key: 'leadpages',
    label: 'LeadPages',
    prompt: 'Copy and paste this embed code into your LeadPage',
    embedGenerator: (url, width, height) => `${iframeStyling} <div class="iframe-container"><iframe id='vr' src='${url}' width='${width}' height='${height}' frameborder='0' allow="autoplay; fullscreen" mozallowfullscreen webkitallowfullscreen allowfullscreen></iframe></div>`,
  },
  {
    key: 'wordpress',
    label: 'WordPress',
    prompt: 'Copy and paste this embed code into your WordPress',
    embedGenerator: (url, width, height) => `${iframeStyling} <div class="iframe-container"><iframe id='vr' src='${url}' width='${width}' height='${height}' frameborder='0' allow="autoplay; fullscreen" mozallowfullscreen webkitallowfullscreen allowfullscreen></iframe></div>`,
  },
  {
    key: 'optimizepress',
    label: 'OptimizePress 2.0',
    prompt: 'Copy and paste this embed code into your Video Player OP 2.0 element',
    embedGenerator: (url, width, height) => `${iframeStyling} <div class="iframe-container"><iframe id='vr' src='${url}' width='${width}' height='${height}' frameborder='0' allow="autoplay; fullscreen" mozallowfullscreen webkitallowfullscreen allowfullscreen></iframe></div>`,
  },
  {
    key: 'facebook-page',
    label: 'Facebook Page',
  },
  {
    key: 'other',
    label: 'Other',
    prompt: 'Copy & Paste this embed code inside the custom HTML element',
    embedGenerator: (url, width, height) => `${iframeStyling} <div class="iframe-container"><iframe id='vr' src='${url}' width='${width}' height='${height}' frameborder='0' allow="autoplay; fullscreen" mozallowfullscreen webkitallowfullscreen allowfullscreen></iframe></div>`,
  },
];

@inject('api')
@inject('store')
@observer
export default class SocialCampaign extends Component {
  static propTypes = {
    className: PropTypes.string,
    project: PropTypes.instanceOf(Project).isRequired,
    onCampaignFinished: PropTypes.func,
    facebookConductor: PropTypes.node.isRequired,
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
      bootstrap: async (instance) => {
        const { facebookConductor } = instance.props;
        instance.provider = new FacebookSocialProvider({ conductor: facebookConductor });
        await instance.provider.init();
        try {
          if (await instance.provider.isAuthorized()) {
            return instance.nextStage();
          }
          return instance.setStage('facebook-login');
        } catch (error) {
          alert(error.message);
          return instance.setStage('facebook-login');
        }
      },
    },
    {
      key: 'facebook-page',
      completionPercentage: 50,
      bootstrap: async (instance) => {
        try {
          const facebookPages = await instance.provider.fetchPagesData();
          if (facebookPages.length) {
            instance.setState({
              selectedFbPage: facebookPages[0].id,
              facebookPages,
            });
            if (facebookPages[0].fanCount >= MIN_FANS_PAGE) {
              const pageTabs = await instance.provider
                .getPageTabs(facebookPages[0].id, facebookPages[0].token);
              instance.setState({
                facebookPageTab: pageTabs[0],
              });
            }
          }
        } catch (error) {
          return alert(error.message);
        }
      },
    },
    {
      key: 'facebook-post',
      completionPercentage: 75,
      bootstrap: async (instance) => {
        const { project } = instance.props;
        const { facebookPages, facebookPageTab, selectedFbPage } = instance.state;
        if (selectedFbPage && facebookPageTab) {
          const fbPage = facebookPages.find(page => page.id === selectedFbPage);
          try {
            const result = instance.provider.createTab(
              fbPage.id, fbPage.token, facebookPageTab.name,
            );
            const parsedTabUrl = result.url.split('/');
            facebookPageTab.id = parsedTabUrl[parsedTabUrl.length - 1];
            if (!facebookPageTab.id) {
              facebookPageTab.id = parsedTabUrl[parsedTabUrl.length - 2];
            }
            try {
              const userData = await instance.provider.fetchUserData();
              instance.setState({ userData });
            } catch (e) {
            }
          } catch (error) {
            return alert(error.message);
          }
        } else {
          const userData = await instance.provider.fetchUserData();
          console.log(userData);
          instance.setState({ userData });
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
    facebookUserData: null,
    facebookPostData: {},
  };

  constructor(props) {
    super(props);

    const { facebookConductor } = this.props;
    this.provider = new FacebookSocialProvider({ conductor: facebookConductor });
  }

  setStage(stageName) {
    let { currentStage } = this.state;
    if (currentStage.key === stageName) {
      return;
    }
    currentStage = this.constructor.STAGES.find(item => item.key === stageName);
    this.setState({ currentStage });
    if (currentStage.bootstrap) {
      currentStage.bootstrap(this);
    }
  }

  canBypassStage(stage) {
    const {
      isLoading,
      embedPage,
      facebookPages,
      selectedFbPage,
      facebookPageTab,
      facebookUserData,
      facebookPostData,
    } = this.state;
    if (isLoading) {
      return false;
    }
    switch (stage.key) {
      case 'embed-engine':
        return true;
      case 'embed-location':
        return embedPage && embedPage.length > 0;
      case 'facebook-login':
        return facebookUserData;
      case 'facebook-page':
        return selectedFbPage &&
          facebookPages.find(page => page.id === selectedFbPage).fanCount >= MIN_FANS_PAGE &&
          facebookPageTab && facebookPageTab.name.length > 0;
      case 'facebook-post':
        return facebookUserData && facebookPostData &&
          facebookPostData.title && facebookPostData.title.length > 0 &&
          facebookPostData.thumbnail && facebookPostData.thumbnail.length > 0;
      default:
        return false;
    }
  }

  nextStage() {
    const { embedLocation } = this.state;
    let { currentStage } = this.state;
    let nextStageIdx = Math.min(
      this.constructor.STAGES.findIndex(item => currentStage.key === item.key) + 1,
      this.constructor.STAGES.length - 1,
    );
    if (currentStage.key === 'facebook-login') {
      switch (embedLocation.key) {
        case 'facebook-page':
          currentStage = this.constructor.STAGES.find(item => item.key === 'facebook-page');
          break;
        default:
          currentStage = this.constructor.STAGES.find(item => item.key === 'facebook-post');
          break;
      }
    } else {
      if (this.constructor.STAGES[nextStageIdx].key === 'embed-location' &&
        ['default', 'facebook-page'].indexOf(embedLocation.key) !== -1) {
        nextStageIdx += 1;
      }
      if (this.constructor.STAGES[nextStageIdx].key === 'facebook-page' && embedLocation.key !== 'facebook-page') {
        nextStageIdx += 1;
      }
      currentStage = this.constructor.STAGES[nextStageIdx];
    }
    this.setState({ currentStage });
    if (currentStage.bootstrap) {
      currentStage.bootstrap(this);
    }
  }

  prevStage() {
    const { embedLocation } = this.state;
    let { currentStage } = this.state;
    if (currentStage.key === 'facebook-page') {
      this.setState({ selectedFbPage: null });
    }
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

  async sharePost() {
    const { api, store, project, onCampaignFinished } = this.props;
    const {
      autoplay,
      preload,
      embedLocation,
      selectedFbPage,
      embedPage,
      facebookPostData,
    } = this.state;

    project.name = facebookPostData.title;
    project.description = facebookPostData.description;
    project.thumbnail = facebookPostData.thumbnail;

    await api.save(project);
    store.activeProject = project;

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
    shareOptions.projectUrl = [
      project.make.url, [
        autoplay ? 'autoplay=1' : null,
        !preload ? 'preload=none' : null,
      ].filter(item => !!item).join('&'),
    ].join('?');
    shareOptions.backendUrl = BACKEND_URL;

    project.name = facebookPostData.title;
    project.description = facebookPostData.description;
    project.thumbnail = facebookPostData.thumbnail;

    await api.publish(await api.save(project));
    store.activeProject = project;

    await api.invalidateFbCache(shareOptions.projectUrl);

    this.expandConductor();
    try {
      await this.provider.share();

      this.collapseConductor();

      if (embedLocation.key === 'facebook-page') {
        const queryString = [
          autoplay ? 'autoplay=1' : null,
          !preload ? 'preload=none' : null,
        ].filter(item => !!item).join('&');

        await api.linkToFbPage(project, selectedFbPage, queryString);
      }
      onCampaignFinished();
    } catch (error) {
      return alert(error.message || 'Unable to post');
    }
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
    facebookConductor.style.zIndex = '11000';
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

    const ProviderPostPreview = this.provider.constructor.PostPreview;

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
                      autoplay ? 'autoplay=1' : null,
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
                onClick={async () => {
                  try {
                    await this.provider.logIn();
                    return this.nextStage();
                  } catch (e) {
                    return this.setStage('facebook-login');
                  }
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
                    onChange={async ({ target: { value } }) => {
                      const fbPage = facebookPages.find(page => page.id === value);
                      this.setState({
                        selectedFbPage: value,
                      });
                      const pageTabs = await this.provider
                        .getPageTabs(fbPage.id, fbPage.token);
                      this.setState({
                        facebookPageTab: pageTabs[0],
                      });
                    }}
                  >
                    {facebookPages.map(
                      ({ id, name }, idx) => <option key={idx} value={id}>{name}</option>,
                    )}
                  </select>
                </div>
                {
                  selectedFbPage && (facebookPages.find(page => page.id === selectedFbPage).fanCount >= MIN_FANS_PAGE) ?
                    <div className="row embed-group">
                      <label className="cell" htmlFor="facebook-page-tab-input">
                        Facebook Page tab name
                      </label>
                      <Input
                        id="facebook-page-tab-input"
                        className="cell facebook-page-tab"
                        type="text"
                        value={facebookPageTab.name}
                        onChange={({ target: { value } }) =>
                          this.setState({ facebookPageTab: { name: value } })}
                      />
                    </div> : null
                }
              </div>
              {!selectedFbPage || (facebookPages.find(page => page.id === selectedFbPage).fanCount < MIN_FANS_PAGE) ?
                <div
                  className="no-enough-fans"
                >
                  <strong>Warning! </strong>The selected page has less than 2,000 fans. As a result, and due to a
                  new Facebook limitation introduced on February 5th, 2018, your video can only be shared on
                  Facebook and not embedded in a tab. This will be corrected soon.
                </div> : null}
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
                          const response = await api.uploadMedia({ data: file });
                          const { facebookPostData } = this.state;
                          facebookPostData.thumbnail = response.url;
                          this.setState({ facebookPostData });
                        }}
                      />
                    </div>
                  </div>
                  <ProviderPostPreview
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
                  'next'} ${this.canBypassStage(currentStage) ?
                  '' :
                  'inactive'}`
              }
              onClick={() => {
                if (!this.canBypassStage(currentStage)) {
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
