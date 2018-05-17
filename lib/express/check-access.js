const {
  access: { minAuthLevel, featureName },
  loginServer: { authUrl: loginURL },
} = require('../../config/config');

module.exports = (req, res, next) => {
  const { session: { user } } = req;

  if (!user) {
    const redirectUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    return res.redirect(`${loginURL}/login?redirect_url=${encodeURIComponent(redirectUrl)}`);
  }

  if (!(user.authorityLevel <= minAuthLevel ||
    (user.features[featureName] && user.features[featureName].state === 'enabled'))) {
    return res.redirect(`${loginURL}/missing-permissions`);
  }

  next();
};
