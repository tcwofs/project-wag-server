const { getUser } = require('../../users');
const { addRoom, getRooms, getRoom, addUserToRoom, removeUserFromRoom } = require('../../rooms');

const getActiveUsersInRoom = ({ roomname }) => {
  const { room } = getRoom({ roomname, type: 'chat' });
  const users = room.users;
  return { users };
};

module.exports = io => {
  const chat = io.of('/chat');
  chat.on('connection', (socket, callback) => {
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

    // socket.on('join', ({ username, room }, callback) => {
    //   const { error, user } = addUser({ id: socket.id, username, room: room });

    //   if (error) return callback(error);

    //   socket.emit('message', { user: 'system', text: `You are connected to a room [${user.room}]` });
    //   socket.broadcast.to(user.room).emit('message', { user: 'system', text: `[${user.username}] connected to a room [${user.room}]` });

    //   socket.join(user.room);

    //   console.log(`User ${socket.id} joined to a room ${user.room}!`);

    //   callback();
    // });

    // socket.on('sendMessage', (message, callback) => {
    //   const user = getUser(socket.id);

    //   chat.to(user.room).emit('message', { user: user.username, text: message });

    //   callback();
    // });

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} left '/chat'!`);
    });
  });
};
