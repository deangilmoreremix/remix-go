import _ from 'lodash';
import { action, observable } from 'mobx';

let store = null;

const AUTH_DATA_CONFIG = { accessToken: 'accessToken', refreshToken: 'refreshToken', path: '/' };

class Store {
  authorization = null;
  request = null;
  socket = null;
  common = {
    hostname: null,
    backend: null,
    socketProtocol: null,
    clientId: null,
    clientSecret: null,
  };

  @observable
  isLoading = false;

  @observable
  currentUser = null;

  constructor(isServer, source, req) {
    if (isServer) {
      // eslint-disable-next-line global-require
      global.FormData = require('form-data');
      // eslint-disable-next-line global-require
      global.fetch = require('isomorphic-fetch');
      global.btoa = string => Buffer.from(string).toString('base64');
      this.req = req;
      this.currentUser = req.session && req.session.user;
    }
    Object.assign(this, source);
    const { common } = this;
    this.clientAuthHeader = `Basic ${btoa(`${common.clientId}:${common.clientSecret}`)}`;
    const accessToken = this.getCookies(AUTH_DATA_CONFIG.accessToken);
    this.setupNetworkServices(accessToken, isServer);
  }

  @action
  fetchHealth() {
    this.isLoading = true;
    try {
      return this.request('/health');
    } finally {
      this.isLoading = false;
    }
  }

  saveAuthData(accessToken, refreshToken, expiresIn) {
    this.setCookies(
      AUTH_DATA_CONFIG.accessToken,
      accessToken,
      // js-cookie takes value expires in days, divide incoming value on 86400
      { expires: expiresIn / 86400, path: AUTH_DATA_CONFIG.path },
    );
    this.setCookies(
      AUTH_DATA_CONFIG.refreshToken,
      refreshToken,
      { path: AUTH_DATA_CONFIG.path },
    );
  }

  cleanAuthData() {
    Cookies.remove(AUTH_DATA_CONFIG.accessToken, { path: AUTH_DATA_CONFIG.path });
    Cookies.remove(AUTH_DATA_CONFIG.refreshToken, { path: AUTH_DATA_CONFIG.path });
  }

  setupNetworkServices(accessToken, isServer) {
    const { common } = this;
    if (accessToken) {
      this.authorization = `Bearer ${accessToken}`;
    } else {
      this.authorization = this.clientAuthHeader;
    }
    this.request = requestCreator(
      common.backend, this.authorization, isServer, () => this.refreshToken());
    if (!isServer) {
      this.socket = socketCreator(`${common.socketProtocol}://${common.backend}`, {
        extraHeaders: {
          Authorization: this.authorization,
        },
      });
    }
  }

  async refreshToken() {
    const existingRefreshToken = this.getCookies(AUTH_DATA_CONFIG.refreshToken);
    if (!existingRefreshToken) {
      return;
    }
    const resp = await this.request('/oauth', {
      method: 'POST',
      body: { grant_type: 'refresh_token', refresh_token: existingRefreshToken },
      headers: {
        Authorization: this.clientAuthHeader,
      },
    });
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
    } = resp;
    this.saveAuthData(accessToken, refreshToken, expiresIn);
    this.authorization = `Bearer ${accessToken}`;
    return this.authorization;
  }

  getCookies(key) {
    return this.req ? (this.req.cookies && this.req.cookies[key]) : Cookies.get(key);
  }

  setCookies(key, value, options) {
    if (!this.req) {
      Cookies.set(key, value, options);
    }
  }
}

export async function initStoreAndPreload(isServer, source, req, preloader) {
  if (isServer) {
    // eslint-disable-next-line global-require
    const config = require('config/config');
    source.common = {
      hostname: req.hostname,
      backend: config.backend,
      socketProtocol: config.socketProtocol,
      clientId: config.client.id,
      clientSecret: config.client.secret,
    };
  }

  if (isServer || store === null) {
    store = new Store(isServer, source, req);
  }

  if (preloader) {
    await preloader(store);
  }

  if (isServer) {
    return _.omit(store, 'request', 'socket', 'req');
  } else {
    return store;
  }
}

export function initStore(source) {
  if (store === null) {
    store = new Store(false, source);
  }
  return store;
}

export default { initStore, initStoreAndPreload };
