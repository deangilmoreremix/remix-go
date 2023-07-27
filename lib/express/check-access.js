const {
  access: { minAuthLevel, features },
  loginServer: { authUrl: loginURL },
} = require('../../config/config');

module.exports = (req, res, next) => {
  const { locals: { populatedUser } } = req;
  const editorUrl = req.whiteLabel ? req.whiteLabel.getEditorUrl() : loginURL;
  if (!populatedUser) {
    let redirectUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    return res.redirect(`${editorUrl}/login?redirect_url=${encodeURIComponent(redirectUrl)}`);
  }
  if (populatedUser && req.params && req.params[0].indexOf('pretend') !== -1) {
    res.redirect('/');
  }
console.log(populatedUser.authorityLevel <= minAuthLevel,"populatedUser.authorityLevel <= minAuthLevel")
  if(!(populatedUser.authorityLevel <= minAuthLevel)) {
    res.redirect("https://go-ai.videoremix.io")
  }
  next();
};
