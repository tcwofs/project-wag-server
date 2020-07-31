const { v4: uuidv4 } = require('uuid');

const chatRooms = [];
const roomPasswords = [];

const addChatRoom = ({ roomname, user, password, privateRoom }) => {
  roomname = roomname.trim().toLowerCase();

  if (roomname === '') {
    return { error: 'Roomname is incorrect. Please choose another one' };
  }

  const existingRoom = chatRooms.find((room) => room.roomname === roomname);

  if (existingRoom) {
    return { error: 'Roomname is taken. Please choose another one' };
  }

  const id = uuidv4();
  const room = { id, roomname, host: user, users: [user], password: !!password, privateRoom };

  if (password) {
    const roomPassword = { id, password };
    roomPasswords.push(roomPassword);
  }

  chatRooms.push(room);

  return { room };
};

const removeChatRoom = ({ roomname }) => {
  const index = chatRooms.findIndex((room) => room.roomane === roomname);
  if (chatRooms[index].password) {
    const indexPassword = roomPasswords.findIndex((room) => room.id === chatRooms[index].id);
    if (index !== -1) {
      roomPasswords.splice(indexPassword, 1);
    }
  }

  if (index !== -1) {
    return chatRooms.splice(index, 1)[0];
  }
};

const getChatRoom = ({ roomname }) => {
  const room = chatRooms.find((room) => room.roomname === roomname.trim().toLowerCase());

  if (room) {
    return { room };
  }

  return { error: 'Room not found!' };
};

const getChatRooms = ({ socket }) =>
  chatRooms.filter((room) => room.privateRoom === false && room.users.filter((user) => user.socket === socket).length === 0);

const addUserToRoom = ({ room, password, user }) => {
  const passwordRoom = roomPasswords.find((el) => el.id === room.id);
  if (room && user) {
    if (!passwordRoom || (passwordRoom.password && passwordRoom.password === password)) {
      room.users.push(user);
      return 0;
    } else {
      return { error: 'Incorrect password!' };
    }
  }
  return { error: 'No such room!' };
};

const removeUserFromRoom = ({ id }) => {
  let room = chatRooms.find((room) => room.users.find((user) => user.id === id));
  if (room) {
    const index = room.users.findIndex((user) => user.id === id);

    if (index !== -1) {
      const user = room.users.splice(index, 1)[0];
      return { room, user };
    }
  }
  return { error: 'Could not remove user from room' };
};

module.exports = { addChatRoom, removeChatRoom, getChatRooms, getChatRoom, addUserToRoom, removeUserFromRoom };
