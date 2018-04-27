const { port } = require('./config/config');

const dev = process.env.NODE_ENV !== 'production';

const express = require('express');
const cookieParser = require('cookie-parser');
const next = require('next');
const mobxReact = require('mobx-react');

const app = next({ dev });
const handle = app.getRequestHandler();

mobxReact.useStaticRendering(true);

app.prepare().then(() => {
  const server = express();
  server.use(cookieParser());
  server.get('*', (req, res) => {
    handle(req, res);
  });
  server.listen(port);
  console.log(`> Ready on http://localhost:${port}`);
});
