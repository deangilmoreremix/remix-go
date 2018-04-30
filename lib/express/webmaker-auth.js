'use strict';

const WebmakerAuth = require('webmaker-auth');

const {
  loginServer: {
    url: loginURL,
    authUrl: authUrl,
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

  // TODO: implement logout call as POST because it's not idempotent call
  app.get('/logout', webmakerAuth.handlers.logout, (req, res) => res.redirect('/'));
  app.get('/account', (req, res) => res.redirect(`${authUrl}/account`));
};