/**
 * Created by Eugene Butusov on 05/11/2018.
 */

/* eslint-disable no-underscore-dangle */

import React from 'react';
import { action, observable } from 'mobx';
import { Input } from 'reactstrap';

import EmbedDataContainer from '../../EmbedDataContainer';
import FacebookPostPreview from '../../../../../components/common/post-previews/FacebookPostPreview';
import CampaignStager from './CampaignStager';

const BACKEND_URL = 'https://api.videoremix.io';
const MIN_FANS_PAGE = 2000;

class LinkedinCampaignStager extends CampaignStager {
  static PostPreview = FacebookPostPreview;

  static EMBED_LOCATIONS = [
    ...CampaignStager.EMBED_LOCATIONS.slice(0, CampaignStager.EMBED_LOCATIONS.length - 1), {
      key: 'facebook-page',
      label: 'Facebook Page',
    }, CampaignStager.EMBED_LOCATIONS[CampaignStager.EMBED_LOCATIONS.length - 1],
  ];

  _stages = [
    {
      key: 'embed-engine',
      completionPercentage: 25,
      element: this.constructor.generateStageComponent(state => (
        <div className="embed-engine">
          <h5 className="embed-title">Where do you want to embed your video?</h5>
          <div className="embed-grid">
            <div className="row embed-group">
              <label className="cell" htmlFor="embed-location-select">Embed Location</label>
              <select
                className="cell"
                name="select"
                id="embed-location-select"
                value={state.variables.embedLocation.key}
                onChange={({ target: { value } }) => {
                  state.variables.embedLocation =
                    this.constructor.EMBED_LOCATIONS.find(item => item.key === value);
                  state.onVariablesUpdated(state.variables);
                }}
              >
                {this.constructor.EMBED_LOCATIONS.map(
                  ({ key, label }) => <option key={key} value={key}>{label}</option>,
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
                checked={state.variables.preload}
                onChange={({ target: { checked } }) => {
                  state.variables.preload = checked;
                  state.onVariablesUpdated(state.variables);
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
                checked={state.variables.autoplay}
                onChange={({ target: { checked } }) => {
                  state.variables.autoplay = checked;
                  state.onVariablesUpdated(state.variables);
                }}
              />
            </div>
          </div>
          <div className={state.variables.embedLocation.embedGenerator ? 'embed-details' : 'hidden'}>
            <span className="embed-line">{state.variables.embedLocation.prompt}</span>
            <EmbedDataContainer
              className="embed-item"
              url={[
                state.project.make.url, [
                  state.variables.autoplay ? 'autoplay=1' : null,
                  !state.variables.preload ? 'preload=none' : null,
                ].filter(item => !!item).join('&')]
                .join('?')}
              stringGenerator={state.variables.embedLocation.embedGenerator}
              resizable
            />
          </div>
        </div>
      )),
    },
  ];

  @observable
  state = {
    currentStageIndex: 0,
    facebookPages: [],
    embedLocation: this.constructor.EMBED_LOCATIONS[0],
    userData: {},
    postData: {},
  };

  async sharePost(api) {
    const { project } = this;
    const {
      autoplay,
      preload,
      embedLocation,
      selectedFbPage,
      embedPage,
      postData,
    } = this.state;

    const shareOptions = {
      shouldCreateTab: embedLocation.key === 'facebook-page',
    };
    if (embedLocation.key === 'facebook-page') {
      shareOptions.pageId = selectedFbPage;
      shareOptions.redirectUrl =
        `${BACKEND_URL}/api/makes/fb/${shareOptions.pageId}/${this.provider.constructor.FB_APP_ID}?mid=${project.make._id}`;
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

    project.name = postData.title;
    project.description = postData.description;
    project.thumbnail = postData.thumbnail;

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
      postData,
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
        return userData && postData &&
          postData.title && postData.title.length > 0 &&
          postData.thumbnail && postData.thumbnail.length > 0;
      default:
        return false;
    }
  }

  @action
  async nextStage() {
    if (this.currentStage.key ===
      this._stages[this._stages.length - 1].key) {
      return this.sharePost();
    }

    const { currentStageIndex, embedLocation } = this.state;
    let nextStageIdx = Math.min(currentStageIndex + 1, this._stages.length - 1);
    if (this._stages[currentStageIndex].key === 'facebook-login') {
      switch (embedLocation.key) {
        case 'facebook-page':
          nextStageIdx = this._stages.indexOf(
            this._stages.find(item => item.key === 'facebook-page'),
          );
          break;
        default:
          nextStageIdx = this._stages.indexOf(
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
    this.state.currentStageIndex = nextStageIdx;
    if (this._stages[this.state.currentStageIndex].bootstrap) {
      await this._stages[this.state.currentStageIndex].bootstrap(this);
    }
    return this._stages[this.state.currentStageIndex];
  }

  @action
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
    if (this._stages[this.state.currentStageIndex].bootstrap) {
      await this._stages[this.state.currentStageIndex].bootstrap(this);
    }
    return this._stages[this.state.currentStageIndex];
  }
}

export default LinkedinCampaignStager;
