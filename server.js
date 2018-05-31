const { port, forceSsl } = require('./config/config');

const dev = process.env.NODE_ENV !== 'production';

const express = require('express');
const next = require('next');
const mobxReact = require('mobx-react');

const app = next({ dev });
const handle = app.getRequestHandler();

const checkAccess = require('./lib/express/check-access');
const { processForm, isValidMedia, mediaUpload } = require('./lib/express/media-upload');
const { join } = require('./lib/express/video-processing');
const getContentType = require('./lib/express/get-content-type');

mobxReact.useStaticRendering(true);

app.prepare().then(() => {
  const server = express();
  server.use((req, res, next) => {
    const schema = req.headers['x-forwarded-proto'] || req.protocol;
    if (schema !== 'https' && forceSsl) {
      // Redirect to https.
      res.redirect(`https://${req.headers.host}${req.url}`);
    } else {
      next();
    }
  });
  require('./lib/express/webmaker-auth')(server);
  server.use(express.json());
  server.use(express.urlencoded());
  // server.post('/api/media/join', join);
  server.put('/api/media', processForm, isValidMedia, mediaUpload);
  server.get('/api/get-content-type', getContentType);

  server.get('/_next/*', (req, res) => {
    handle(req, res);
  });
  server.get('*', checkAccess, (req, res) => {
    handle(req, res);
  });
  server.listen(port);
  console.log(`> Ready on http://localhost:${port}`);
});
