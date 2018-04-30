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
  app.get('/logout', (req, res) => {
    req.session.email = req.session.user = req.session.refreshAfter = null;
    return res.redirect('/');
  });
  app.get('/account', (req, res) => res.redirect(`${authUrl}/account`));
};