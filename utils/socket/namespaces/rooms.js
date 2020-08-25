const { getUser } = require('../../services/users');
const {
  addRoom,
  getActiveUsersInRoom,
  getRooms,
  addUserToRoom,
  getRoom,

  removeUserFromRoom,
} = require('../../services/rooms');
const { createDeck, updateField } = require('../../services/durak');

module.exports = (io) => {
  const rooms = io.of('/main');
  rooms.on('connection', (socket) => {
    console.log(`User ${socket.conn.id} listenning to a '/main'!`);

    let user;

    setTimeout(() => {
      user = getUser({ socket: socket.conn.id });
      if (!user) {
        socket.emit('error-redirect', { error: 'Error occured you will be redirected to home page' });
        return;
      }
    }, 1000);

    socket.on('get-all-rooms', ({ type }) => {
      const rooms = getRooms({ type });
      socket.emit('get-all-rooms', { rooms });
    });

    socket.on('new-room', ({ roomname, password, privateRoom, type }) => {
      const { error, room } = addRoom({ roomname, password, privateRoom, type, user });
      socket.emit('new-chat-room-confirmed', { error, room });
      if (room) {
        socket.broadcast.emit('emit-all-rooms');
        socket.join(`${room.id}_${room.roomname}`);
        return 0;
      }
    });

    socket.on('connect-room', ({ roomname, password }) => {
      const { error, room } = getRoom({ roomname });
      if (room) {
        const { error, errorConnected } = addUserToRoom({ room, password, user });
        socket.emit('connect-room-confirmed', { errorPassword: error, errorRoom: errorConnected, room });
        if (!error) {
          socket.broadcast.emit('emit-all-rooms');
          socket.broadcast.emit('emit-room-users');
          socket.join(`${room.id}_${room.roomname}`);
        }
        return 0;
      }
      socket.emit('connect-room-confirmed', { errorRoom: error });
    });

    socket.on('leave-room', ({ roomname, user }) => {
      const { room } = getRoom({ roomname });
      if (room) {
        const { error } = removeUserFromRoom({ roomname, user });
        if (!error) {
          socket.broadcast.emit('emit-all-rooms');
          socket.broadcast.emit('emit-room-users');
        }
        return 0;
      }
    });

    socket.on('get-room-users', ({ roomname }) => {
      const { users } = getActiveUsersInRoom({ roomname });
      if (users) {
        socket.emit('get-room-users', { users });
      }
    });

    socket.on('user-ready', ({ roomname, user }) => {
      const { room } = getRoom({ roomname });
      if (room) {
        const userReady = room.users.find((item) => item.id === user.id);
        userReady.ready = !userReady.ready;
        rooms.emit('emit-room-users');
        const usersReady = room.users.filter((user) => user.ready === true);
        if (room.users.length > 1 && room.users.length === usersReady.length) {
          rooms.to(`${room.id}_${room.roomname}`).emit('start-game');
          const { deck, users } = createDeck(room.users);
          room.deck = deck;
          room.users = users;
          setTimeout(() => {
            updateField({ room, durak: rooms });
          }, 500);
          room.active = false;
          socket.broadcast.emit('emit-all-rooms');
        }
      }
    });

    socket.on('disconnect', () => {
      socket.broadcast.emit('emit-all-rooms');
      socket.broadcast.emit('emit-room-users');
      console.log(`User ${socket.conn.id} left '/rooms'!`);
    });
  });
};
