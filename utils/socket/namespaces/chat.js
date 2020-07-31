const { getUser } = require('./users');
const { addChatRoom, getChatRooms, getChatRoom, removeChatRoom, addUserToRoom } = require('../../services/chatrooms');

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
      if (error) {
        socket.emit('new-chat-room-confirmed', { error });
      } else if (room) {
        user.chatRooms.push({ id: room.id, roomname: room.roomname, host: room.host.id });
        socket.emit('new-chat-room-confirmed', { error });
        socket.emit('get-user-chatrooms', { rooms: user.chatRooms });
      }
    });

    socket.on('connect-chat-room', ({ roomname, password }) => {
      const { error, room } = getChatRoom({ roomname });
      if (error) {
        socket.emit('connect-chat-room-confirmed', { errorRoom: error });
      } else if (room) {
        const { error } = addUserToRoom({ room, password, user });
        if (error) {
          socket.emit('connect-chat-room-confirmed', { errorPassword: error });
          return;
        }
        user.chatRooms.push({ id: room.id, roomname: room.roomname, host: room.host.id });
        socket.emit('connect-chat-room-confirmed', { errorPassword: error });
        socket.emit('get-user-chatrooms', { rooms: user.chatRooms });
      }
    });

    socket.on('get-all-chatrooms', () => {
      const rooms = getChatRooms({ socket: socket.conn.id });
      socket.emit('get-all-chatrooms', { rooms });
    });

    socket.on('del-room', ({ roomname }) => {
      const rooms = getChatRooms();
      socket.emit('get-all-chatrooms', { rooms });
    });

    socket.on('get-users', ({ roomname }) => {
      const { users } = getActiveUsersInRoom({ roomname });
      console.log(users);
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} left '/chatrooms'!`);
    });
  });
};
