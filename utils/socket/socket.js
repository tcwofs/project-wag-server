const { addUser, removeUser } = require('./users');

const socketio = require('socket.io');

module.exports.listen = app => {
  let io = socketio.listen(app);

  require('./namespaces/rooms')(io);
  require('./namespaces/chat')(io);
  require('./namespaces/durak')(io);
  require('./namespaces/ttt')(io);

  io.on('connection', socket => {
    console.log(`User ${socket.id} connected!`);

    socket.on('new-user-connection', ({ username }) => {
      const { existingUserError, user } = addUser({ id: socket.conn.id, username });
      if (existingUserError) {
        socket.emit('error-redirect', { error: existingUserError });
        return;
      }
      console.log(`User [${user.id} // ${user.username}] successfully connected!`);
    });

    socket.on('disconnect', () => {
      const { removeUsererror, user } = removeUser(socket.conn.id);
      if (removeUsererror) {
        console.log(removeUsererror);
        return;
      }
      console.log(`User [${user.id} // ${user.username}] left!`);
    });
  });

  return io;
};
