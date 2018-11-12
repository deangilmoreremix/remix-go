/**
 * Created by Eugene Butusov on 06/11/2018.
 */

/* eslint-disable no-underscore-dangle */
import Cookies from 'js-cookie';

import AbstractSocialProvider from './AbstractSocialProvider';
import LinkedinPostPreview from '../../components/common/post-previews/LinkedinPostPreview';
import requestCreator from '../requestCreator';

class LinkedinSocialProvider extends AbstractSocialProvider {
  static PostPreview = LinkedinPostPreview;
  static ACCESS_SCOPES = 'r_basicprofile r_emailaddress w_share';
  static OAUTH_CALLBACK = 'https://api.videoremix.io/api/makes/social-proxy/linkedin/oauth2-callback';
  static PROFILE_FIELDS = 'picture-urls::(original),first-name,last-name,email-address,formatted-name,headline';
  static DEFAULT_USERPIC = 'http://emblemsbf.com/img/11864.jpg';

  _retrieveAccessToken() {
    return Cookies.get('li_acc_tkn');
  }

  init() {
    this.api = requestCreator(
      'api.videoremix.io/api/makes/social-proxy/linkedin',
      this.authorization, false,
      () => {},
    );
    return true;
  }

  isAuthorized() {
    return !!this._retrieveAccessToken();
  }

  async logIn() {
    return new Promise((resolve, reject) => {
      if (!this._retrieveAccessToken()) {
        const linkedinLoginWindow = window.open(`${'https://www.linkedin.com/oauth/v2/authorization' +
          '?response_type=code' +
          '&client_id='}${this.config.clientId
        }&scope=${encodeURIComponent(this.constructor.ACCESS_SCOPES)
        }&redirect_uri=${encodeURIComponent(this.constructor.OAUTH_CALLBACK)
        }&state=${encodeURIComponent(document.location.href)}`,
        'linkedin_login',
        'width=650,height=650');
        const loginCheckInterval = setInterval(() => {
          if (!linkedinLoginWindow || linkedinLoginWindow.closed) {
            clearInterval(loginCheckInterval);
            if (this._retrieveAccessToken()) {
              resolve();
            } else {
              reject(new Error('Auth canceled.'));
            }
          }
        }, 100);
      } else {
        resolve();
      }
    });
  }

  async fetchUserData() {
    const response = await this.api(
      `/fetch-data?fields=${this.constructor.PROFILE_FIELDS}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this._retrieveAccessToken()}`,
        },
      });
    return {
      name: response.formattedName,
      headline: response.headline,
      userpic: (
        response.pictureUrls && response.pictureUrls.values && response.pictureUrls.values[0]
      ) || this.constructor.DEFAULT_USERPIC,
    };
  }

  async share(options) {
    return this.api(
      '/share', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this._retrieveAccessToken()}`,
        },
        body: {
          content: {
            title: options.title,
            description: options.description,
            'submitted-url': options.url,
            'submitted-image-url': options.thumbnail,
          },
          comment: options.description,
          visibility: { code: 'anyone' },
        },
      });
  }
}

export default LinkedinSocialProvider;
