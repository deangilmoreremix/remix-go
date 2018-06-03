const { loaderIo: { key } } = require('../../config/config');

module.exports = (app) => {
  app.get(`/${key}/`, (req, res) => res.send(key));
};
