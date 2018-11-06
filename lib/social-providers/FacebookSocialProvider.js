/**
 * Created by Eugene Butusov on 02/11/2018.
 */

/* eslint-disable no-underscore-dangle */

import AbstractSocialProvider from './AbstractSocialProvider';
import FacebookPostPreview from '../../components/common/post-previews/FacebookPostPreview';

class FacebookSocialProvider extends AbstractSocialProvider {
  static PostPreview = FacebookPostPreview;

  static FB_APP_ID = '1728968890675795';
  static FACEBOOK_PERMISSIONS = 'manage_pages,pages_show_list';
  static FB_DEFAULT_USERPIC = 'http://emblemsbf.com/img/11864.jpg';
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

  _postResponsiveMessage(data) {
    const { conductor } = this.config;
    const messageId = `${Date.now()}/${Math.random()}`;

    const result = new Promise((resolve, reject) => {
      const receiver = ({ data: messageData }) => {
        if (messageData.messageId !== messageId) {
          return;
        }
        window.removeEventListener('message', receiver);
        if (messageData.error) {
          reject(messageData.error);
        } else {
          resolve(messageData);
        }
      };
      window.addEventListener('message', receiver);
    });

    conductor.contentWindow.postMessage({
      messageId,
      topic: data.topic,
      arguments: data.arguments,
    }, conductor.src);
    return result;
  }

  constructor(config) {
    super(config);

    const { conductor } = this.config;
    conductor.contentWindow.postMessage({
      topic: 'Initial load',
      config: {},
      topics: this.constructor.FACEBOOK_MESSAGE_TOPICS,
      parentWindowUrl: window.location.origin + window.location.pathname,
    }, conductor.src);
  }

  async init() {
    return this._postResponsiveMessage({
      topic: this.constructor.FACEBOOK_MESSAGE_TOPICS.init,
      arguments: this.constructor.FB_APP_ID,
    });
  }

  async isAuthorized() {
    return (await this._postResponsiveMessage({
      topic: this.constructor.FACEBOOK_MESSAGE_TOPICS.settleAuth,
      arguments: this.constructor.FACEBOOK_PERMISSIONS,
    })).loggedIn;
  }

  async logIn() {
    return this._postResponsiveMessage({
      topic: this.constructor.FACEBOOK_MESSAGE_TOPICS.logIn,
      arguments: this.constructor.FACEBOOK_PERMISSIONS,
    });
  }

  async fetchPagesData() {
    const { result } = await this._postResponsiveMessage({
      topic: this.constructor.FACEBOOK_MESSAGE_TOPICS.fetchPagesData,
    });
    const pages = [];
    result.forEach((page) => {
      pages.push({
        id: page.id,
        name: page.name,
        token: page.access_token,
        fanCount: page.fan_count,
      });
    });
    return pages;
  }

  async getPageTabs(pageId, pageAccessToken) {
    const { result } = await this._postResponsiveMessage({
      topic: this.constructor.FACEBOOK_MESSAGE_TOPICS.getPageTabs,
      arguments: { pageId, pageAccessToken },
    });
    const tabs = [];
    result.data.forEach((tab) => {
      const tabAppId = tab.application && tab.application.id;
      if (tabAppId === this.constructor.FB_APP_ID) {
        tabs.push({
          name: tab.name,
          id: tab.id,
        });
      }
    });
    return tabs;
  }

  async createTab(pageId, pageAccessToken, tabName) {
    return this._postResponsiveMessage({
      topic: this.constructor.FACEBOOK_MESSAGE_TOPICS.createTab,
      arguments: { pageId, pageAccessToken, tabName },
    });
  }

  async fetchUserData() {
    const { result } = await this._postResponsiveMessage({
      topic: this.constructor.FACEBOOK_MESSAGE_TOPICS.fetchUserData,
    });
    return {
      name: result.NAME,
      userpic: result.IMAGE || this.constructor.FB_DEFAULT_USERPIC,
    };
  }

  async share(options) {
    return this._postResponsiveMessage({
      topic: this.constructor.FACEBOOK_MESSAGE_TOPICS.share,
      arguments: options,
    });
  }

  collapseConductor() {
    const { conductor } = this.config;
    conductor.style.width = '1px';
    conductor.style.height = '1px';
  }

  expandConductor() {
    const { conductor } = this.config;
    conductor.style.width = '100%';
    conductor.style.height = '100%';
    conductor.style.zIndex = '11000';
    conductor.style.position = 'fixed';
    conductor.style.top = 0;
    conductor.style.left = 0;
  }
}

export default FacebookSocialProvider;
