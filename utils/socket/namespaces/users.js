const users = [];

const addUser = ({ id, username, socket }) => {
  const existingUser = users.find((user) => user.id === id);

  if (existingUser) {
    return { existingUserError: 'Username is existing. You will be redirected to home page' };
  }

  const user = { id, username, socket, chatRooms: [], rooms: [] };
  users.push(user);

  return 0;
};

const removeUser = ({ id }) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    const user = users.splice(index, 1)[0];
    return { user };
  }

  return { removeUsererror: 'Tried to remove non-existing user' };
};

const getUser = ({ socket }) => users.find((user) => user.socket === socket);

const addChatRoomToUser = ({ userid, roomid }) => {
  const userindex = users.findIndex((user) => user.id === userid);
  const room = getChatRoom({ roomid });
  users[userindex].chatRooms.push({ id: room.id, roomane: room.roomname });
};

// const addRoomToUser = ({ userid, roomid, type }) => {
//   const userindex = users.findIndex((user) => user.id === userid);
//   const room = getRoom({ roomid });
//   users[userindex].chatRooms.push({ id: room.id, roomane: room.roomname });
// };

module.exports = { addUser, removeUser, getUser, addChatRoomToUser };
