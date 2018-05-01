import _ from 'lodash';
import { action, observable } from 'mobx';
import requestCreator from "../lib/requestCreator";

let templateApi = null;

class TemplateApi {

  @observable
  isLoading = false;

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
    this.perPage = common.templates.perPage;
    this.authorization = `Basic ${btoa(`${common.clientId}:${common.clientSecret}`)}`;
    this.setupNetworkServices(isServer);
  }

  setupNetworkServices(isServer) {
    const { common } = this;
    this.request = requestCreator(common.backend, this.authorization, isServer, () => { });
  }

  @action
  async list(page = 0, query = '') {
    this.isLoading = true;
    try {
      return this.request(
        `/api/makes/templates?perPage=${this.perPage}&page=${page + 1}&q=${query}`, {
        method: 'GET',
        headers: {
          'on-behalf': this.currentUser.id,
        }
      });
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async one(id) {

  }
}

export async function initApiAndPreload(isServer, source, req, preloader) {
  if (isServer) {
    // eslint-disable-next-line global-require
    const config = require('config/config');
    source.common = {
      hostname: req.hostname,
      backend: config.backend,
      clientId: config.client.id,
      clientSecret: config.client.secret,
      templates: {
        perPage: config.templates.perPage,
      },
    };
  }

  if (isServer || templateApi === null) {
    templateApi = new TemplateApi(isServer, source, req);
  }

  if (preloader) {
    await preloader(templateApi);
  }

  if (isServer) {
    return _.omit(templateApi, 'request', 'socket', 'req');
  } else {
    return templateApi;
  }
}

export function initApi(source) {
  if (templateApi === null) {
    templateApi = new TemplateApi(false, source);
  }
  return templateApi;
}

export default { initApi, initApiAndPreload };
