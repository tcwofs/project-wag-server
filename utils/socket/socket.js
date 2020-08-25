const socketio = require('socket.io');

module.exports.listen = (app) => {
  let io = socketio.listen(app);

  require('./namespaces/login')(io);
  require('./namespaces/chat')(io);
  require('./namespaces/rooms')(io);
  require('./namespaces/durak')(io);

  return io;
};
