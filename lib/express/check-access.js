const {
  access: { minAuthLevel, features },
  loginServer: { authUrl: loginURL },
} = require('../../config/config');

module.exports = (req, res, next) => {
  const { locals: { populatedUser } } = req;
  const editorUrl = req.whiteLabel ? req.whiteLabel.getEditorUrl() : loginURL;

  if (!populatedUser) {
    let redirectUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    if(!(populatedUser.authorityLevel <= minAuthLevel)) {
      redirectUrl = 'https://go-ai.videoremix.io';
    }
    console.log(redirectUrl,"redirectUrl==")
    return res.redirect(`${editorUrl}/login?redirect_url=${encodeURIComponent(redirectUrl)}`);
  }

  if (!(populatedUser.authorityLevel <= minAuthLevel ||
    (populatedUser.features[features.main] && populatedUser.features[features.main].state === 'enabled'))) {
    return res.redirect(`${editorUrl}/missing-permissions`);
  }

  if (populatedUser && req.params && req.params[0].indexOf('pretend') !== -1) {
    if(!(populatedUser.authorityLevel <= minAuthLevel)) {
      console.log("call here")
      res.redirect("https://go-ai.videoremix.io");
      // redirectUrl = 'https://go-ai.videoremix.io';
    }
    res.redirect('/');
  }
  next();
};
