module.exports = {
  port: process.env.PORT || 3000,
  backend: process.env.BACKEND || 'dev-api.videoremix.io',
  editor: process.env.EDITOR || 'dev-app.videoremix.io',
  assetsPath: process.env.ASSETS_PATH || 'dev-cdn.videoremix.io/resources/go',
  socketProtocol: process.env.SOCKET_PROTOCOL || 'ws',
  client: {
    id: process.env.CLIENT_ID || 'service',
    secret: process.env.CLIENT_SECRET || 'q39Jy70X6ao9dTca',
  },
  loginServer: {
    url: process.env.LOGIN_SERVER_URL || 'http://localhost:1340',
    authUrl: process.env.AUTH_SERVER_URL || 'http://localhost:8888',
    urlWithAuth: process.env.LOGIN_SERVER_URL_WITH_AUTH || 'http://testuser:password@localhost:1340',
  },
  secret: process.env.SECRET || 'dummy secret value',
  appHostname: process.env.APP_HOSTNAME || 'http://localhost:3000',
  cookieDomain: process.env.COOKIE_DOMAIN || '',
  forceSsl: process.env.FORCE_SSL || false,
  templates: {
    perPage: process.env.TEMPLATES_PER_PAGE || 25,
  },
  s3: {
    cdn: process.env.CDN_HOSTNAME || '',
    key: process.env.S3_KEY || 'AKIAIAQ6WDZIWRHJTGVA',
    bucket: process.env.S3_BUCKET || 'videoremix',
    secret: process.env.S3_SECRET || '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',
    domain: process.env.S3_DOMAIN || 'http://videoremix.s3-website-us-west-1.amazonaws.com',
    emulation: process.env.S3_EMULATION || false,
    publishLifetime: process.env.S3_PUBLISH_LIFETIME || 3600,
  },
};
