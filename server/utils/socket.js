const socketio = require('socket.io');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./chat/users.js');

module.exports.listen = app => {
  io = socketio.listen(app);

  io.on('connection', socket => {
    console.log(`User ${socket.id} connected!`);
    socket.emit('console-msg', 'Hello world!');

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} left!`);
    });
  });

  const rooms = io.of('/rooms');
  rooms.on('connection', socket => {
    console.log(`User ${socket.id} connected to a '/rooms'!`);

    socket.on('get-active-rooms', data => {
      console.log(data.type);
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} left '/room'!`);
    });
  });

  const chat = io.of('/chat');
  chat.on('connection', (socket, callback) => {
    console.log(`User ${socket.id} connected to a '/chat'!`);

    socket.on('join', ({ username, room }, callback) => {
      const { error, user } = addUser({ id: socket.id, username, room });

      if (error) return callback(error);

      socket.emit('message', { user: 'system', text: `You are connected to a room [${user.room}]` });
      socket.broadcast.to(user.room).emit('message', { user: 'system', text: `[${user.username}] connected to a room [${user.room}]` });

      socket.join(user.room);

      console.log(`User ${socket.id} joined to a room ${user.room}!`);

      callback();
    });

    socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id);

      chat.to(user.room).emit('message', { user: user.username, text: message });

      callback();
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} left '/chat'!`);
    });
  });

  return io;
};
