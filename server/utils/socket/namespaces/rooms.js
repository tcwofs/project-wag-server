const { getUser } = require('../users');
const { addRoom, getRooms, addUserToRoom, removeUserFromRoom, removeRoom } = require('../rooms');

module.exports = io => {
  const rooms = io.of('/rooms');
  rooms.on('connection', socket => {
    console.log(`User ${socket.conn.id} listenning to a '/rooms'!`);

    const user = getUser(socket.conn.id);

    if (!user) {
      socket.emit('error-redirect', { error: 'Error occured you will be redirected to home page' });
      return;
    }

    socket.on('get-active-rooms', ({ type }) => {
      const rooms = getRooms(type);
      if (rooms) {
        socket.emit('get-active-rooms', rooms);
      }
    });

    socket.on('connect-new-room', ({ roomname, type }) => {
      const user = getUser(socket.conn.id);
      if (user) {
        const { error, room } = addRoom({ roomname, type, user });
        if (room) {
          socket.emit('room created');
          return;
        }
        socket.emit('error-msg', { error });
        return;
      }
      socket.emit('error-redirect', { error: 'Could not find user' });
    });

    socket.on('connect-exist-room', ({ roomname, type }) => {
      const user = getUser(socket.conn.id);
      if (user) {
        const { error, room } = addUserToRoom({ roomname, type, user });
        if (room) {
          socket.emit('room created');
          return;
        }
        socket.emit('error-msg', { error });
        return;
      }
      socket.emit('error-redirect', { error: 'Could not find user' });
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.conn.id} left '/rooms'!`);
    });
  });
};
