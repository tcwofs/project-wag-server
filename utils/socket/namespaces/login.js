const { addUser, removeUser } = require('./users');

module.exports = (io) => {
  const login = io.of('/login');
  login.on('connection', (socket) => {
    console.log(`User ${socket.id} connected!`);

    socket.on('new-user-connection', ({ user }) => {
      const { id, username } = user;
      const { existingUserError } = addUser({ id, username, socket: socket.conn.id });
      if (existingUserError) {
        socket.emit('error-redirect', { error: existingUserError });
        return;
      }
      console.log(`User [${id} // ${username} // ${socket.conn.id}] successfully connected!`);
    });

    socket.on('disconnect', () => {
      const { removeUsererror, user } = removeUser({ id: socket.conn.id });
      if (removeUsererror) {
        console.log(removeUsererror);
        return;
      }
      console.log(`User [${user.id} // ${user.username} // ${user.socket}] left!`);
    });
  });
};
