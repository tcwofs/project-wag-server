const { getUser } = require('../users');
const { getRoom } = require('../rooms');

const getActiveUsersInRoom = ({ roomname }) => {
  const { room } = getRoom({ roomname, type: 'chat' });
  const users = room.users;
  return { users };
};

module.exports = io => {
  const chat = io.of('/chat');
  chat.on('connection', socket => {
    console.log(`User ${socket.id} connected to a '/chat'!`);

    const user = getUser(socket.conn.id);

    if (!user) {
      socket.emit('error-redirect', { error: 'Error occured you will be redirected to home page' });
      return;
    }

    socket.on('get-users', ({ roomname }) => {
      const { users } = getActiveUsersInRoom({ roomname });
      console.log(users);
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} left '/chat'!`);
    });
  });
};
