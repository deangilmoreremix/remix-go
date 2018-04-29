'use strict';

const { loginServer: { url: loginURL } } = require('../../config/config');

module.exports = function (req, res, next) {
  const user = req.session && req.session.user;

  if (!user) {
    const redirectUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.redirect(`${loginURL}/login?redirect_url=${encodeURIComponent(redirectUrl)}`);
    return false;
  }

  if (user.missingGrants || (user.roles && user.roles.length === 0)) {
    return res.redirect('/missing-permissions');
  }

  next();
};