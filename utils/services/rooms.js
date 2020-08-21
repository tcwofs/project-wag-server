const { v4: uuidv4 } = require('uuid');
const services = require('../../services.json');

const rooms = [];
const roomPasswords = [];

const addRoom = ({ roomname, password, privateRoom, type, user }) => {
  roomname = roomname.trim().toLowerCase();

  user.ready = false;

  if (roomname === '') {
    return { error: 'Roomname is incorrect. Please choose another one' };
  }

  const existingRoom = rooms.find((room) => room.roomname === roomname);

  if (existingRoom) {
    return { error: 'Roomname is taken. Please choose another one' };
  }

  const id = uuidv4();
  const room = { id, roomname, type, users: [user], active: true, password: !!password, privateRoom };
  rooms.push(room);
  if (password) {
    roomPasswords.push({ id, password });
  }

  return { room };
};

const getRoom = ({ roomname }) => {
  const room = rooms.find((room) => room.roomname === roomname.trim().toLowerCase());

  if (room) {
    return { room };
  }

  return { error: 'Room not found!' };
};

const getRoomByID = ({ roomId }) => {
  const room = rooms.find((room) => room.id === roomId);

  if (room) {
    return { room };
  }

  return { error: 'Room not found!' };
};

const getRooms = ({ type }) => rooms.filter((room) => room.type === type && room.active === true && room.privateRoom === false);

const addUserToRoom = ({ room, password, user }) => {
  if (!user) return 0;
  const passwordRoom = roomPasswords.find((el) => el.id === room.id);
  const existingRoom = rooms.find((item) => item.roomname === room.roomname);
  const existingUser = existingRoom.users.findIndex((item) => item.id === user.id);
  if (room && existingUser === -1) {
    if (room.users.length === services.find((item) => item.type === room.type).maxUsers) return { errorConnected: 'Max users reached', error: true };
    if (!passwordRoom || (passwordRoom.password && passwordRoom.password === password)) {
      user.ready = false;
      room.users.push(user);
      return 0;
    } else {
      return { error: 'Incorrect password!' };
    }
  }
  return { errorConnected: 'Already connected' };
};

const removeUserFromRoom = ({ roomname, user }) => {
  let roomIndex = rooms.findIndex((room) => room.roomname === roomname);
  if (roomIndex !== -1) {
    const userIndex = rooms[roomIndex].users.findIndex((item) => item.id === user.id);

    if (userIndex !== -1) {
      rooms[roomIndex].users.splice(userIndex, 1);

      if (rooms[roomIndex].users.length === 0) {
        removeRoom({ roomname });
      }
      return 0;
    }
  }
  return { error: 'Could not remove user from room' };
};

const removeRoom = ({ roomname }) => {
  const index = rooms.findIndex((room) => room.roomname === roomname);
  if (rooms[index].password) {
    const indexPassword = roomPasswords.findIndex((room) => room.id === rooms[index].id);
    if (index !== -1) {
      roomPasswords.splice(indexPassword, 1);
    }
  }

  if (index !== -1) {
    return rooms.splice(index, 1)[0];
  }
};

const removeUserFromAllRoom = ({ user }) => {
  let room;
  let roomIndex = rooms.findIndex((room) => room.users.find((item) => item.id === user.id));
  if (roomIndex !== -1) {
    let userIndex = rooms[roomIndex].users.findIndex((item) => item.id === user.id);
    if (userIndex !== -1) {
      room = rooms[roomIndex];
      if (rooms[roomIndex].users.length === 0) {
        removeRoom({ roomname: rooms[roomIndex].roomname });
      }
      return { room };
    }
    return { error: 'Could not find user' };
  }

  return { error: 'Could not find room' };
};

const getActiveUsersInRoom = ({ roomname }) => {
  let roomIndex = rooms.findIndex((room) => room.roomname === roomname);
  let users = [];
  if (roomIndex !== -1) users = rooms[roomIndex].users;

  return { users };
};

module.exports = {
  addRoom,
  removeRoom,
  getRooms,
  getRoom,
  addUserToRoom,
  removeUserFromRoom,
  getRoomByID,
  removeUserFromAllRoom,
  getActiveUsersInRoom,
};
