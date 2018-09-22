const config = require('../config/config');

const s3 = (function () {
  const emulated = config.s3.emulation || !config.s3.key;
  const options = {
    bucket: config.s3.bucket,
    key: config.s3.key,
    secret: config.s3.secret,
    domain: config.s3.domain,
  };
  const s3lib = emulated ? require('noxmox').mox : require('knox');
  return s3lib.createClient(options);
}());

module.exports = s3;

module.exports.mediaClient = (function () {
  const emulated = config.s3.emulation || !config.s3.key;
  const options = {
    bucket: config.s3.mediaBucket,
    key: config.s3.key,
    secret: config.s3.secret,
    domain: config.s3.domain,
  };
  const s3lib = emulated ? require('noxmox').mox : require('knox');
  return s3lib.createClient(options);
}());
