const { loaderIo: { key } } = require('../../config/config');

module.exports = (app) => {
  if (key) {
    app.get(`/${key}/`, (req, res) => res.send(key));
  }
};
