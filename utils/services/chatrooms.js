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
  const room = {
    id,
    roomname,
    host: user,
    users: [user],
    password: !!password,
    privateRoom,
    messages: [
      {
        id: uuidv4(),
        from: 'System',
        text: `${user.username} connected`,
      },
    ],
  };

  if (password) {
    const roomPassword = { id, password };
    roomPasswords.push(roomPassword);
  }

  chatRooms.push(room);

  return { room };
};

const removeChatRoom = ({ roomname }) => {
  const index = chatRooms.findIndex((room) => room.roomname === roomname);
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

const getUserRooms = ({ userid }) => chatRooms.filter((room) => room.users.filter((user) => user.id === userid).length === 1);

const addUserToRoom = ({ room, password, user }) => {
  const passwordRoom = roomPasswords.find((el) => el.id === room.id);
  const existingUser = chatRooms.map((room) => room.users.findIndex((item) => item.id === user.id));
  if (room && existingUser[0] === -1) {
    if (!passwordRoom || (passwordRoom.password && passwordRoom.password === password)) {
      room.users.push(user);
      room.messages.push({ id: uuidv4(), from: 'System', text: `${user.username} connected` });
      return 0;
    } else {
      return { error: 'Incorrect password!' };
    }
  }
  return { errorConnected: 'Already connected' };
};

const removeUserFromRoom = ({ roomname, user }) => {
  let roomIndex = chatRooms.findIndex((room) => room.roomname === roomname);
  if (roomIndex !== -1) {
    const userIndex = chatRooms[roomIndex].users.findIndex((item) => item.id === user.id);

    if (userIndex !== -1) {
      chatRooms[roomIndex].users.splice(userIndex, 1);
      if (chatRooms[roomIndex].users.length === 0) {
        removeChatRoom({ roomname });
      }
      return 0;
    }
  }
  return { error: 'Could not remove user from room' };
};

const getActiveUsersInRoom = ({ roomname }) => {
  let roomIndex = chatRooms.findIndex((room) => room.roomname === roomname);
  let users = [];
  if (roomIndex !== -1) users = chatRooms[roomIndex].users;

  return { users };
};

const removeUserFromAllRoom = ({ user }) => {
  let indexes = [];
  if (!user) return;
  for (let i = 0; i < chatRooms.length; i++) {
    for (let j = 0; j < chatRooms[i].users.length; j++) {
      if (chatRooms[i].users[j].id === user.id) indexes.push({ room: i, user: j });
    }
  }

  if (indexes.length !== 0) {
    for (let i = indexes.length - 1; i >= 0; i--) {
      chatRooms[indexes[i].room].users.splice(indexes[i].user, 1);
      if (chatRooms[indexes[i].room].users.length === 0) {
        removeChatRoom({ roomname: chatRooms[indexes[i].room].roomname });
      }
    }
  }

  return 0;
};

module.exports = {
  addChatRoom,
  removeChatRoom,
  getChatRooms,
  getChatRoom,
  addUserToRoom,
  removeUserFromRoom,
  removeUserFromAllRoom,
  getActiveUsersInRoom,
  getUserRooms,
};
