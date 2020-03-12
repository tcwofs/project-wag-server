const { addUser, removeUser, getUser, getUsersInRoom } = require('../../users.js');
const { addRoom, removeRoom, getRooms } = require('../../rooms.js');

module.exports = io => {
  const chat = io.of('/durak');
  chat.on('connection', (socket, callback) => {
    console.log(`User ${socket.id} connected to a '/durak'!`);

    const user = getUser(socket.conn.id);

    if (!user) {
      socket.emit('error-redirect', { error: 'Error occured you will be redirected to home page' });
      return;
    }

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} left '/durak'!`);
      const user = removeUser(socket.id);
    });
  });
};
