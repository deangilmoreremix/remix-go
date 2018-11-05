/**
 * Created by Eugene Butusov on 05/11/2018.
 */

/* eslint-disable no-underscore-dangle */

import React from 'react';
import { Input } from 'reactstrap';

import FacebookSocialProvider from '../../../../../lib/social-providers/FacebookSocialProvider';
import EmbedDataContainer from '../../EmbedDataContainer';

// const ProviderPostPreview = this.provider.constructor.PostPreview;

const iframeStyling = `<!--- VideoRemix embed styling ---->
<style> 
  .iframe-container { position:relative; padding-bottom:56.25%; padding-top:30px; height:0; overflow:hidden; border:1px solid #ccc; }
  .iframe-container iframe,.iframe-container object,.iframe-container embed { position:absolute; top:0; left:0; width:100%; height:100%; }
</style>
<!--- End of VideoRemix embed styling ---->
`;

const FB_APP_ID = '1728968890675795';
const BACKEND_URL = 'https://api.videoremix.io';
const MIN_FANS_PAGE = 2000;

class FacebookCampaignStager {
  static EMBED_LOCATIONS = [
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

  _stages = [
    {
      key: 'embed-engine',
      completionPercentage: 25,
      element: (<div className={`embed-engine ${this.currentStage.key !== 'embed-engine' && 'hidden'}`}>
        <h5 className="embed-title">Where do you want to embed your video?</h5>
        <div className="embed-grid">
          <div className="row embed-group">
            <label className="cell" htmlFor="embed-location-select">Embed Location</label>
            <select
              className="cell"
              name="select"
              id="embed-location-select"
              value={this.state.embedLocation.key}
              onChange={({ target: { value } }) => {
                this.state.embedLocation = this.embedLocations.find(item => item.key === value);
              }}
            >
              {this.embedLocations.map(
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
              checked={this.state.preload}
              onChange={({ target: { checked } }) => {
                this.state.preload = checked;
              }}
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
              checked={this.state.autoplay}
              onChange={({ target: { checked } }) => {
                this.state.autoplay = checked;
              }}
            />
          </div>
        </div>
        <div className={this.state.embedLocation.embedGenerator ? 'embed-details' : 'hidden'}>
          <span className="embed-line">{this.state.embedLocation.prompt}</span>
          <EmbedDataContainer
            className="embed-item"
            url={[
              this.project.make.url, [
                this.state.autoplay ? 'autoplay=1' : null,
                !this.state.preload ? 'preload=none' : null,
              ].filter(item => !!item).join('&')]
              .join('?')}
            stringGenerator={this.state.embedLocation.embedGenerator}
            resizable
          />
        </div>
      </div>),
    },
    {
      key: 'embed-location',
      completionPercentage: 25,
      element: (<div className={`embed-location ${this.currentStage.key !== 'embed-location' && 'hidden'}`}>
        <h5 className="embed-title">URL Link to your page with your embedded video</h5>
        <Input
          type="text"
          className="embed-page-input"
          value={this.state.embedPage}
          onChange={({ target: { value } }) => {
            this.state.embedPage = value;
          }}
        />
      </div>),
    },
    {
      key: 'facebook-login',
      completionPercentage: 50,
      element: (
        <div className={`facebook-login ${this.currentStage.key !== 'facebook-login' && 'hidden'}`}>
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
      ),
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
      element: (
        <div className={`facebook-page ${this.currentStage.key !== 'facebook-page' && 'hidden'}`}>
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
                value={this.state.selectedFbPage}
                onChange={async ({ target: { value } }) => {
                  const fbPage = this.state.facebookPages.find(page => page.id === value);
                  this.state.selectedFbPage = value;
                  [this.state.facebookPageTab] = await this.provider
                    .getPageTabs(fbPage.id, fbPage.token);
                }}
              >
                {this.state.facebookPages.map(
                  ({ id, name }, idx) => <option key={idx} value={id}>{name}</option>,
                )}
                </select>
            </div>
            {
              this.state.selectedFbPage &&
              (this.state.facebookPages.find(
                page => page.id === this.state.selectedFbPage,
              ).fanCount >= MIN_FANS_PAGE) ?
                <div className="row embed-group">
                  <label className="cell" htmlFor="facebook-page-tab-input">
                    Facebook Page tab name
                  </label>
                  <Input
                    id="facebook-page-tab-input"
                    className="cell facebook-page-tab"
                    type="text"
                    value={this.state.facebookPageTab.name}
                    onChange={({ target: { value } }) => {
                      this.state.facebookPageTab.name = value;
                    }}
                  />
                </div> : null
            }
            </div>
          {!this.state.selectedFbPage ||
          (this.state.facebookPages.find(
            page => page.id === this.state.selectedFbPage,
          ).fanCount < MIN_FANS_PAGE) ?
            <div
              className="no-enough-fans"
            >
              <strong>Warning! </strong>The selected page has less than 2,000 fans. As a result, and due to a
              new Facebook limitation introduced on February 5th, 2018, your video can only be shared on
              Facebook and not embedded in a tab. This will be corrected soon.
            </div> : null}
        </div>
      ),
      bootstrap: async (instance) => {
        try {
          const facebookPages = await instance.provider.fetchPagesData();
          if (facebookPages.length) {
            instance.state.selectedFbPage = facebookPages[0].id;
            instance.state.facebookPages = facebookPages;
            if (facebookPages[0].fanCount >= MIN_FANS_PAGE) {
              const pageTabs = await instance.provider
                .getPageTabs(facebookPages[0].id, facebookPages[0].token);
              this.state.facebookPageTab = pageTabs[0];
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
      element: (<div className={`facebook-post ${this.currentStage.key !== 'facebook-post' && 'hidden'}`}>
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
                  value={this.state.facebookPostData.link}
                  onChange={({ target: { value } }) => {
                    const { facebookPostData } = this.state;
                    facebookPostData.link = value;
                    this.state.facebookPostData = facebookPostData;
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
                  value={this.state.facebookPostData.title}
                  onChange={({ target: { value } }) => {
                    const { facebookPostData } = this.state;
                    facebookPostData.title = value;
                    this.state.facebookPostData = facebookPostData;
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
                  value={this.state.facebookPostData.description}
                  onChange={({ target: { value } }) => {
                    const { facebookPostData } = this.state;
                    facebookPostData.description = value;
                    this.state.facebookPostData = facebookPostData;
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
                    // const response = await api.uploadMedia({ data: file });
                    // const { facebookPostData } = this.state;
                    // facebookPostData.thumbnail = response.url;
                    // this.setState({ facebookPostData });
                  }}
                />
              </div>
            </div>
            <this.provider.constructor.PostPreview
              className="cell"
              user={this.state.userData}
              post={this.state.facebookPostData}
            />
          </div>
        </div>
      </div>),
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
              instance.state.userData = await instance.provider.fetchUserData();
            } catch (e) {
            }
          } catch (error) {
            return alert(error.message);
          }
        } else {
          instance.state.userData = await instance.provider.fetchUserData();
        }
        instance.state.facebookPostData = {
          title: project.name,
          thumbnail: project.thumbnail,
          description: project.description,
          link: project.make.url,
        };
      },
    },
  ];

  state = { currentStageIndex: -1 };

  constructor(provider, project) {
    this.provider = provider;
    this.project = project;
    this.state = { currentStageIndex: -1 };
  }

  async sharePost(api) {
    const { project } = this;
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

    await api.invalidateFbCache(shareOptions.projectUrl);

    this.provider.expandConductor();
    await this.provider.share(shareOptions);

    this.provider.collapseConductor();

    if (embedLocation.key === 'facebook-page') {
      const queryString = [
        autoplay ? 'autoplay=1' : null,
        !preload ? 'preload=none' : null,
      ].filter(item => !!item).join('&');

      await api.linkToFbPage(project, selectedFbPage, queryString);
    }
    return project;
  }

  canBypassStage(stage) {
    const {
      isLoading,
      embedPage,
      facebookPages,
      selectedFbPage,
      facebookPageTab,
      userData,
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
        return userData;
      case 'facebook-page':
        return selectedFbPage &&
          facebookPages.find(page => page.id === selectedFbPage).fanCount >= MIN_FANS_PAGE &&
          facebookPageTab && facebookPageTab.name.length > 0;
      case 'facebook-post':
        return userData && facebookPostData &&
          facebookPostData.title && facebookPostData.title.length > 0 &&
          facebookPostData.thumbnail && facebookPostData.thumbnail.length > 0;
      default:
        return false;
    }
  }

  async nextStage() {
    if (this.currentStage.key ===
      this._stages[this._stages.length - 1].key) {
      return this.sharePost();
    }

    const { embedLocation } = this.state;
    let { currentStageIndex } = this.state;
    let nextStageIdx = Math.min(currentStageIndex + 1, this._stages.length - 1);
    if (this._stages[currentStageIndex].key === 'facebook-login') {
      switch (embedLocation.key) {
        case 'facebook-page':
          currentStageIndex = this._stages.indexOf(
            this._stages.find(item => item.key === 'facebook-page'),
          );
          break;
        default:
          currentStageIndex = this._stages.indexOf(
            this._stages.find(item => item.key === 'facebook-post'),
          );
          break;
      }
    } else {
      if (this._stages[nextStageIdx].key === 'embed-location' &&
        ['default', 'facebook-page'].indexOf(embedLocation.key) !== -1) {
        nextStageIdx += 1;
      }
      if (this._stages[nextStageIdx].key === 'facebook-page' && embedLocation.key !== 'facebook-page') {
        nextStageIdx += 1;
      }
    }
    this.state.currentStageIndex = this._stages.indexOf(nextStageIdx);
    if (currentStageIndex.bootstrap) {
      currentStageIndex.bootstrap(this);
    }
  }

  async prevStage() {
    const { currentStageIndex, embedLocation } = this.state;
    if (this._stages[currentStageIndex].key === 'facebook-page') {
      this.state.selectedFbPage = null;
    }
    let prevStageIdx = Math.min(
      currentStageIndex - 1,
      0,
    );
    if ((this._stages[prevStageIdx].key === 'embed-location' && embedLocation.key === 'default') ||
      (this._stages[prevStageIdx].key === 'facebook-page' && embedLocation.key !== 'facebook-page')) {
      prevStageIdx -= 1;
    }
    this.state.currentStageIndex = prevStageIdx;
  }

  async setStage(stageName) {
    const { currentStageIndex } = this.state;
    let currentStage = this._stages[currentStageIndex];
    if (currentStage.key === stageName) {
      return;
    }
    currentStage = this._stages.find(item => item.key === stageName);
    this.state.currentStageIndex = this._stages.indexOf(currentStage);
    if (currentStageIndex.bootstrap) {
      await currentStageIndex.bootstrap(this);
    }
    return currentStage;
  }

  get embedLocations() {
    return this.constructor.EMBED_LOCATIONS;
  }

  get stages() {
    return this._stages;
  }

  get currentStage() {
    return this._stages[this.state ? this.state.currentStageIndex : 0];
  }
}

export default FacebookCampaignStager;
