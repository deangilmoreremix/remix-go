module.exports = {
  port: process.env.PORT || 3000,
  backend: process.env.BACKEND || 'dev-api.videoremix.io',
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
};
