'use strict';

const { loginServer: { authUrl: loginURL } } = require('../../config/config');

module.exports = function (req, res, next) {
  const { session: { user } } = req;

  if (!user) {
    const redirectUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    return res.redirect(`${loginURL}/login?redirect_url=${encodeURIComponent(redirectUrl)}`);
  }

  next();
};