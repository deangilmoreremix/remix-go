import _ from 'lodash';
import { action, observable } from 'mobx';
import requestCreator from '../lib/requestCreator';

let api = null;

class Api {
  @observable
  isLoading = false;

  static ASSET_TYPE = {
    VIDEOS: 'videos',
    AUDIOS: 'audios',
  };

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
    this.request = requestCreator(common.backend, this.authorization, isServer, () => {});
    this.assetsRequest = requestCreator(common.assetsPath, this.authorization, isServer, () => {});
    this.editorRequest = requestCreator(common.editor, null, isServer, () => {});
    this.selfRequest = requestCreator(common.self, null, isServer, () => {});
  }

  @action
  async assets(assetType) {
    this.isLoading = true;
    try {
      return this.assetsRequest(
        `/${assetType}/index.json`, {
          method: 'GET',
        });
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async templates(page = 0, query = '') {
    this.isLoading = true;
    try {
      return this.request(
        `/api/makes/go?segment=templates&perPage=${this.perPage}&page=${page + 1}&q=${query}`, {
          method: 'GET',
          headers: {
            'on-behalf': this.currentUser.id,
          },
        });
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async nicheScripts(page = 0, query = '') {
    this.isLoading = true;
    try {
      return this.request(
        `/api/makes/go?segment=nicheScripts&perPage=${this.perPage}&page=${page + 1}&q=${query}`, {
          method: 'GET',
          headers: {
            'on-behalf': this.currentUser.id,
          },
        });
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async cta(page = 0, query = '') {
    this.isLoading = true;
    try {
      return this.request(
        `/api/makes/go?segment=cta&perPage=${this.perPage}&page=${page + 1}&q=${query}`, {
          method: 'GET',
          headers: {
            'on-behalf': this.currentUser.id,
          },
        });
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async uploadImage(data) {
    this.isLoading = true;
    try {
      if (typeof data === 'string') {
        data = { srcUrl: data };
      } else {
        const fd = new FormData();
        fd.append('image', data);
        data = fd;
      }
      return this.selfRequest(
        '/api/image?original=true', {
          method: 'PUT',
          body: data,
        });
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async save(project) {
    this.isLoading = true;
    try {
      const response = await this.request(
        '/api/users/me/makes', {
          method: 'POST',
          headers: {
            'on-behalf': this.currentUser.id,
          },
          body: {
            title: project.serialize().name,
            description: project.serialize().description,
            project: project.serialize(),
          },
        });
      project.make = response._id;
      return project;
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async publish(project) {
    this.isLoading = true;
    try {
      const response = await this.request(
        `/api/users/me/makes/${project.make}/publish`, {
          method: 'POST',
          headers: {
            'on-behalf': this.currentUser.id,
          },
        });
      project.url = response.url;
      project.contentUrl = response.contenturl;
      return project;
    } finally {
      this.isLoading = false;
    }
  }
}

export async function initApiAndPreload(isServer, source, req, preloader) {
  if (isServer) {
    // eslint-disable-next-line global-require
    const config = require('config/config');
    source.common = {
      hostname: req.hostname,
      backend: config.backend,
      editor: config.editor,
      self: req.get && req.get('host'),
      assetsPath: config.assetsPath,
      clientId: config.client.id,
      clientSecret: config.client.secret,
      templates: {
        perPage: config.templates.perPage,
      },
    };
  }

  if (isServer || api === null) {
    api = new Api(isServer, source, req);
  }

  if (preloader) {
    await preloader(api);
  }

  if (isServer) {
    return _.omit(api, 'request', 'socket', 'req');
  } else {
    return api;
  }
}

export function initApi(source) {
  if (api === null) {
    api = new Api(false, source);
  }
  return api;
}

export default { initApi, initApiAndPreload };
