'use strict';

const WebmakerAuth = require('webmaker-auth');

const {
  loginServer: {
    url: loginURL,
    urlWithAuth: authLoginURL,
  },
  appHostname: loginHost,
  secret: secretKey,
  forceSsl: forceSSL,
  cookieDomain: domain,
} = require('../../config/config');

const webmakerAuth = new WebmakerAuth({ loginURL, loginHost, authLoginURL, secretKey, forceSSL, domain });

module.exports = (app) => {
  app.use(webmakerAuth.cookieParser());
  app.use(webmakerAuth.cookieSession());
};