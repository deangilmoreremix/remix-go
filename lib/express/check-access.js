const {
  access: { minAuthLevel, features },
  loginServer: { authUrl: loginURL },
} = require('../../config/config');

module.exports = (req, res, next) => {
  const { session: { user } } = req;
  const editorUrl = req.whiteLabel ? req.whiteLabel.getEditorUrl() : loginURL;

  if (!user) {
    const redirectUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    return res.redirect(`${editorUrl}/login?redirect_url=${encodeURIComponent(redirectUrl)}`);
  }

  if (!(user.authorityLevel <= minAuthLevel ||
    (user.features[features.main] && user.features[features.main].state === 'enabled'))) {
    return res.redirect(`${editorUrl}/missing-permissions`);
  }

  next();
};
