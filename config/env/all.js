module.exports = {
  port: process.env.PORT || 3000,
  backend: process.env.BACKEND || 'localhost:1340',
  socketProtocol: process.env.SOCKET_PROTOCOL || 'ws',
  client: {
    id: process.env.CLIENT_ID || 'default',
    secret: process.env.CLIENT_SECRET || 'default',
  },
};
