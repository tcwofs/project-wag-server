const { getUser } = require('../../services/users');
const {
  addChatRoom,
  getChatRooms,
  getChatRoom,
  removeChatRoom,
  addUserToRoom,
  getUserRooms,
  removeUserFromRoom,
  getActiveUsersInRoom,
  removeUserFromAllRoom,
  pushMessage,
} = require('../../services/chat');

module.exports = (io) => {
  const chat = io.of('/chat');
  chat.on('connection', (socket) => {
    console.log(`User ${socket.id} connected to a '/chat'!`);

    let user;

    setTimeout(() => {
      user = getUser({ socket: socket.conn.id });
      if (!user) {
        socket.emit('error-redirect', { error: 'Error occured you will be redirected to home page' });
        return;
      }
    }, 1000);

    socket.on('new-chat-room', ({ roomname, password, privateRoom }) => {
      const { error, room } = addChatRoom({ roomname, user, password, privateRoom });
      socket.emit('new-chat-room-confirmed', { error });
      if (room) {
        const rooms = getUserRooms({ userid: user.id });
        socket.emit('get-user-chatrooms', { rooms });
        chat.emit('emit-all-chatrooms');
        chat.emit('emit-users');
      }
    });

    socket.on('connect-chat-room', ({ roomname, password }) => {
      const { error, room } = getChatRoom({ roomname });
      socket.emit('connect-chat-room-confirmed', { errorRoom: error });
      if (room) {
        const { error, errorConnected } = addUserToRoom({ room, password, user });
        socket.emit('connect-chat-room-confirmed', { errorPassword: error, errorRoom: errorConnected });
        if (!error) {
          const rooms = getUserRooms({ userid: user.id });
          socket.emit('get-user-chatrooms', { rooms });
          chat.emit('emit-all-chatrooms');
          socket.broadcast.emit('emit-users');
          socket.broadcast.emit('emit-messages');
        }
      }
    });

    socket.on('get-all-chatrooms', () => {
      const rooms = getChatRooms({ socket: socket.conn.id });
      socket.emit('get-all-chatrooms', { rooms });
    });

    socket.on('get-user-chatrooms', () => {
      const rooms = getUserRooms({ userid: user.id });
      socket.emit('get-user-chatrooms', { rooms });
    });

    socket.on('del-room', ({ roomname }) => {
      removeChatRoom({ roomname });
      chat.emit('emit-user-chatrooms');
      chat.emit('emit-all-chatrooms');
      chat.emit('emit-users');
    });

    socket.on('leave-room', ({ roomname }) => {
      removeUserFromRoom({ roomname, user });
      chat.emit('emit-user-chatrooms');
      chat.emit('emit-all-chatrooms');
      chat.emit('emit-users');
    });

    socket.on('get-users', ({ roomname }) => {
      const { users } = getActiveUsersInRoom({ roomname });
      socket.emit('get-users', { users });
    });

    socket.on('get-messages', ({ roomname }) => {
      const { room } = getChatRoom({ roomname });
      socket.emit('get-messages', { messages: room.messages });
    });

    socket.on('send-message', ({ message, roomname, user }) => {
      pushMessage({ message, roomname, user });
      socket.broadcast.emit('emit-messages');
    });

    socket.on('disconnect', () => {
      removeUserFromAllRoom({ user });
      socket.broadcast.emit('emit-users');
      socket.broadcast.emit('emit-messages');
      console.log(`User ${socket.id} left '/chatrooms'!`);
    });
  });
};
