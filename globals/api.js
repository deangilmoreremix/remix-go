import _ from 'lodash';
import { action, observable } from 'mobx';
import requestCreator from '../lib/requestCreator';

let api = null;

class Api {
  @observable
  isLoading = false;

  static ASSET_TYPES = {
    VIDEOS: 'videos',
    AUDIOS: 'audios',
    IMAGES: 'images',
  };

  static ASSET_SCOPES = {
    LIBRARY: 'LIBRARY',
    UPLOADS: 'UPLOADS',
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
    this.perPage = common.pagination.perPage;
    this.authorization = `Basic ${btoa(`${common.clientId}:${common.clientSecret}`)}`;
    this.setupNetworkServices(isServer);
  }

  setupNetworkServices(isServer) {
    const { common } = this;
    this.request = requestCreator(common.backend.url, this.authorization, isServer, () => {});
    this.assetsRequest = requestCreator(common.assetsPath, this.authorization, isServer, () => {});
    this.editorRequest = requestCreator(common.editor, null, isServer, () => {});
    this.selfRequest = requestCreator(common.self, null, isServer, () => {});
  }

  @action
  async assets(assetScope, assetType, count = 0, query = '') {
    this.isLoading = true;
    try {
      if (assetScope === Api.ASSET_SCOPES.LIBRARY) {
        let response = await this.assetsRequest(
          `/${assetType}/index.json`, {
            method: 'GET',
          });
        response.reverse();
        if (query.length > 0) {
          const lookup = new RegExp(`.*${query}.*`, 'i');
          response = response.filter(
            item => lookup.test(item.title) || (item.keywords && lookup.test(item.keywords)),
          );
        }
        return response.slice(count, count + this.perPage);
      } else {
        const page = Math.ceil(count / this.perPage);
        const mediaAssetKinds = {
          [Api.ASSET_TYPES.AUDIOS]: 'audio',
          [Api.ASSET_TYPES.VIDEOS]: 'video',
        };
        return this.request(
          `/api/users/me/media-assets?kind=${mediaAssetKinds[assetType]}&perPage=${this.perPage}&page=${page + 1}&q=${query}`, {
            method: 'GET',
            headers: {
              'on-behalf': this.currentUser.id,
            },
          });
      }
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async templates(count = 0, query = '') {
    this.isLoading = true;
    const page = Math.ceil(count / this.perPage);
    try {
      return this.request(
        `/api/makes/templates?editor=go&perPage=${this.perPage}&page=${page + 1}&q=${query}`, {
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
  async nicheScripts(count = 0, query = '') {
    this.isLoading = true;
    const page = Math.ceil(count / this.perPage);
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
  async cta(count = 0, query = '') {
    this.isLoading = true;
    const page = Math.ceil(count / this.perPage);
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
  async defaults(count = 0, query = '') {
    this.isLoading = true;
    const page = Math.ceil(count / this.perPage);
    try {
      return this.request(
        `/api/makes/go?segment=defaults&perPage=${this.perPage}&page=${page + 1}&q=${query}`, {
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
  async get(projectId, isSource) {
    this.isLoading = true;
    const path = isSource ?
      `/api/users/me/makes/${projectId}` :
      `/api/users/me/makes/${projectId}/remix`;
    try {
      return this.request(
        path, {
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
  async save(project) {
    this.isLoading = true;
    try {
      const path = project.make ?
        `/api/users/me/makes/${project.make._id}` :
        '/api/users/me/makes';
      const serializedProject = project.serialize();
      project.make = await this.request(
        path, {
          method: project.make ? 'PATCH' : 'POST',
          headers: {
            'on-behalf': this.currentUser.id,
          },
          body: {
            title: serializedProject.name,
            description: serializedProject.description,
            project: serializedProject,
            thumbnail: serializedProject.thumbnail,
            remixedFrom: serializedProject.source,
          },
        });
      project.modified = false;
      return project;
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async mergeMedia(videoSrc, audioSrc) {
    this.isLoading = true;
    try {
      return this.selfRequest(
        '/api/media/join', {
          method: 'POST',
          body: { videoSrc, audioSrc },
        });
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async publish(project) {
    this.isLoading = true;
    try {
      const response = await this.request(
        `/api/users/me/makes/${project.make._id}/publish`, {
          method: 'POST',
          headers: {
            'on-behalf': this.currentUser.id,
          },
        });
      project.make.url = response.url;
      project.make.contentUrl = response.contenturl;
      return project;
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async storeAsset(url, preview, type) {
    const mediaAssetKinds = {
      [Api.ASSET_TYPES.AUDIOS]: 'audio',
      [Api.ASSET_TYPES.VIDEOS]: 'video',
      [Api.ASSET_TYPES.IMAGES]: 'image',
    };
    this.isLoading = true;
    try {
      return await this.request(
        '/api/users/me/media-assets', {
          method: 'POST',
          headers: {
            'on-behalf': this.currentUser.id,
          },
          body: {
            url,
            preview,
            kind: mediaAssetKinds[type],
          },
        });
    } finally {
      this.isLoading = false;
    }
  }

  @action
  uploadMedia({ data, preview }, onProgress = () => {}) {
    this.isLoading = true;
    return new Promise((resolve, reject) => {
      if (typeof data === 'string') {
        data = JSON.stringify({ srcUrl: data });
      } else {
        const fd = new FormData();
        fd.append('media', data);
        data = fd;
      }

      const xhr = new XMLHttpRequest();
      if (onProgress) {
        xhr.upload.onprogress = ({ loaded, total }) => {
          onProgress(loaded / total);
        };
      }
      xhr.open('PUT', `//${this.common.self}/api/media?${preview ? 'video_preview=true' : ''}`, true);
      xhr.onload = () => {
        if (onProgress) {
          onProgress(1.0);
        }
        this.isLoading = false;
        if (xhr.status !== 200) {
          console.log(xhr.responseText);
          return reject(JSON.parse(xhr.responseText));
          // return reject(new Error(`HTTP error ${xhr.status}.`));
        }
        try {
          return resolve(JSON.parse(xhr.responseText));
        } catch (err) {
          return reject(err);
        }
      };
      xhr.send(data);
    });
  }

  @action
  async linkToFbPage(project, pageId, queryString) {
    this.isLoading = true;
    try {
      return this.request(
        `/api/makes/${project.make._id}/link-to-fb-page/${pageId}`, {
          method: 'POST',
          headers: {
            'on-behalf': this.currentUser.id,
          },
          body: { queryString },
        });
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async invalidateFbCache(url) {
    this.isLoading = true;
    try {
      return this.request(
        '/api/makes/update-fb-cache', {
          method: 'POST',
          headers: {
            'on-behalf': this.currentUser.id,
          },
          body: { publishUrl: url },
        });
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
      self: config.self || (req.get && req.get('host')),
      assetsPath: config.assetsPath,
      clientId: config.client.id,
      clientSecret: config.client.secret,
      pagination: {
        perPage: config.pagination.perPage,
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
