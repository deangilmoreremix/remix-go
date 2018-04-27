import io from 'socket.io-client';

export default function (hostname, options = {}) {
  if (options.extraHeaders && options.extraHeaders.Authorization) {
    hostname += `?authorization=${encodeURIComponent(options.extraHeaders.Authorization)}`;
  }

  const socket = io.connect(hostname, options);

  socket.on('connect', () => {
    console.log(`socket connected ${socket.id}`);
  });
  socket.on('disconnect', () => {
    console.log(`socket disconnected ${socket.id}`);
  });
  socket.on('reconnecting', () => {
    console.log('socket reconnecting...');
  });
  socket.on('reconnect', () => {
    console.log('socket reconnected');
  });
  socket.on('reconnect_error', (error) => {
    console.log('socket reconnect error', error);
  });
  socket.on('reconnect_failed', (error) => {
    console.log('socket reconnect failed', error);
  });
  socket.on('error', (error) => {
    console.error('socket error', error);
  });
  return socket;
}
