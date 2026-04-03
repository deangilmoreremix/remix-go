const { port, forceSsl, nakedRun } = require('./config/config');

const dev = process.env.NODE_ENV !== 'production';

const express = require('express');
const compression = require('compression');
const next = require('next');
const mobxReact = require('mobx-react');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = next({ dev });
const handle = app.getRequestHandler();

const checkAccess = require('./lib/express/check-access');
const { processForm, isValidMedia, mediaUpload } = require('./lib/express/media-upload');
// const { join } = require('./lib/express/video-processing');
const getContentType = require('./lib/express/get-content-type');

mobxReact.useStaticRendering(true);

app.prepare().then(() => {
  const server = express();
  server.use(compression());
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
  server.use(express.json({ limit: '10mb' }));
  server.use(express.urlencoded({ extended: true }));
  require('./lib/express/loaderio')(server);
  // server.post('/api/media/join', join);
  server.put('/api/media', processForm, isValidMedia, mediaUpload);
  server.get('/api/get-content-type', getContentType);

  // Proxy Remix Go app routes
  if (dev) {
    // Development: Proxy to Vite dev server on port 5173
    server.use('/apps/remix-go', createProxyMiddleware({
      target: 'http://localhost:5173',
      changeOrigin: true,
      pathRewrite: { '^/apps/remix-go': '' }
    }));
  } else {
    // Production: Serve built static files
    server.use('/apps/remix-go', express.static(require('path').join(__dirname, 'apps/remix-go/dist')));
  }

  if (!nakedRun) {
    server.get('/_next/*', (req, res) => {
      handle(req, res);
    });
    server.get('*', checkAccess, (req, res) => {
      handle(req, res);
    });
  }
  server.listen(port);
  console.log(`> Ready on http://localhost:${port}`);
});
