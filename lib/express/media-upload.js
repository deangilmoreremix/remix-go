const Bb = require('bluebird');
const fs = Bb.promisifyAll(require('fs'));
const uuid = require('node-uuid');
const request = Bb.promisify(require('request'));
const sharp = require('sharp');
const multiparty = require('multiparty');

const s3 = require('../s3');

const config = require('../../config/config');

const validMimeTypes = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
};

const parseTempFiles = (req) => {
  let paths = [];

  if (req.files) {
    paths = Object.keys(req.files).map(field =>
      [req.files[field]].map(file => file.path)).reduce((prev, curr) => prev.concat(curr), []);
  }

  return paths;
};

const cleanUpTempFiles = (paths) => {
  paths = paths || [];

  return Bb
    .map(paths, path => fs.unlink(path))
    .catch(err => console.log(err));
};

module.exports.mediaUpload = (req, res) => {
  function uploadFromFile(req, res) {
    // We've verified the media is valid in filters
    const media = req.files.media[0] || req.files.media;
    const extension = validMimeTypes[media.headers['content-type']];
    const s3Path = `/user_media/${uuid.v4()}${extension}`;

    return fs
      .readFileAsync(media.path)
      .then(sourceMedia => s3.putBuffer(sourceMedia, s3Path, {
        'x-amz-acl': 'public-read',
        'Content-Length': sourceMedia.length,
        'Content-Type': media.headers['content-type'],
      }, (err, response) => {
        cleanUpTempFiles(parseTempFiles(req));

        if (err) {
          return res.json(400, { error: `S3.putImage returned ${err}` });
        }

        if (response.statusCode !== 200) {
          res.json(400, { error: 'Failed to upload media. Uploading file failed.' });
          return;
        }

        return res.json({ url: `${config.s3.cdn}${s3Path}` });
      }))
      .catch(error => res.json(400, { error: error.message }));
  }

  function uploadFromUrl(req, res) {
    const urlRegex = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
    if (!urlRegex.test(req.body.srcUrl)) {
      return res.json(400, { error: 'Invalid url. Uploading file failed.' });
    }

    const extension = `.${req.body.srcUrl.split('.').pop()}`;
    const s3Path = `/user_media/${uuid.v4()}${extension}`;

    return request({
      method: 'GET',
      encoding: null,
      url: req.body.srcUrl,
      followAllRedirects: true,
      maxRedirects: 2,
      timeout: 20 * 1000, // in ms
    })
      .then((response) => {
        if (response.headers['content-type'].indexOf('image/') === -1) {
          return res.json(400, { error: 'Failed to upload image. Wrong content-type.' });
        }

        if (response.statusCode !== 200) {
          return res.json(response.statusCode || 400, { error: 'Failed to upload image. Uploading file failed.' });
        }

        const sourceImage = response.body;

        const preprocessing = req.query.original === 'true' ? Bb.try(() => sourceImage) : sharp(sourceImage)
          .resize(1200, 630)
          .crop()
          .toBuffer();

        return preprocessing
          .then(outputBuffer => s3.putBuffer(outputBuffer, s3Path, {
            'x-amz-acl': 'public-read',
            'Content-Length': outputBuffer.length,
            'Content-Type': response.headers['content-length'],
          }, (err, response) => {
            cleanUpTempFiles(parseTempFiles(req));

            if (err) {
              return res.json(400, { error: `S3.putImage returned ${err}` });
            }

            if (response.statusCode !== 200) {
              return res.json(400, { message: 'Failed to upload image. Uploading file failed.' });
            }

            return res.json({ url: `${config.s3.cdn}${s3Path}` });
          }));
      })
      .catch(error => res.json(400, { error: error.message }));
  }

  if (req.body.srcUrl) {
    uploadFromUrl(req, res);
  } else {
    uploadFromFile(req, res);
  }
};

module.exports.processForm = (req, res, next) => {
  // If we need to copy from srcUrl, skip parsing
  if (req.body.srcUrl || req.body.imageDataUri) {
    return next();
  }

  const form = new multiparty.Form();

  form.parse(req, (err, fields, files) => {
    if (err) {
      return next(500);
    }

    req.body = fields;
    req.files = files;

    next();
  });
};

module.exports.isValidMedia = (req, res, next) => {
  // If we need to copy from srcUrl, skip checking
  if (req.body.srcUrl) {
    return next();
  }

  const media = Array.isArray(req.files.media) ? req.files.media[0] : req.files.media;

  if (media && validMimeTypes[media.headers['content-type']]) {
    return next();
  }

  return res.json(400, {
    error: 'invalid_mimetype',
    message: 'This image format is not supported.',
  });
};
