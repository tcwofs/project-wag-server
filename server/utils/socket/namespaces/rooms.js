const { getUser } = require('../../users');
const { addRoom, getRooms, addUserToRoom, removeUserFromRoom, removeRoom } = require('../../rooms');

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
      console.log(rooms);
      if (rooms) {
        socket.emit('get-active-rooms', rooms);
      }
    });

    socket.on('connect-new-room', ({ roomname, type }) => {
      const user = getUser(socket.conn.id);
      if (user) {
        const { error, room } = addRoom({ roomname, type, user });
        if (room) {
          socket.join(room.id);
          socket.emit('room created');
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
          socket.join(room.id + room.roomname);
          socket.emit('room created');
        }
        socket.emit('error-msg', { error });
        return;
      }
      socket.emit('error-redirect', { error: 'Could not find user' });
    });

    socket.on('disconnect', () => {
      const { error, room } = removeUserFromRoom({ id: socket.conn.id });
      if (!error) {
        socket.leave(room.id + room.roomname);
        if (room.users.length === 0) {
          removeRoom(room.id);
        }
      }
      console.log(`User ${socket.conn.id} left '/rooms'!`);
    });
  });
};
