let roomId = 0;

const rooms = [];

const addRoom = ({ roomname, type, user }) => {
  const { id, username } = user;
  roomname = roomname.trim().toLowerCase();

  const existingRoom = rooms.find(room => room.roomname === roomname && room.type === type);

  if (existingRoom) {
    return { error: 'Roomname is taken. Please choose another one' };
  }

  const room = { id: roomId++, roomname, type, users: [{ id, username }] };
  rooms.push(room);

  return { room };
};

const removeRoom = id => {
  const index = rooms.findIndex(room => room.id === id);

  if (index !== -1) {
    return rooms.splice(index, 1)[0];
  }
};

const getRoom = ({ roomname, type }) => {
  const room = rooms.find(room => room.roomname === roomname && room.type === type);

  return { room };
};

const getRooms = type => rooms.filter(room => room.type === type);

const addUserToRoom = ({ roomname, type, user }) => {
  let { room } = getRoom({ roomname, type });
  if (room && user) {
    room.users.push(user);
    rooms[room.id] = room;
    return { room };
  }
  return { error: 'Seems like room has been deleted' };
};

const removeUserFromRoom = ({ id }) => {
  let room = rooms.find(room => room.users.find(user => user.id === id));
  if (room) {
    const index = room.users.findIndex(user => user.id === id);

    if (index !== -1) {
      room.users.splice(index, 1)[0];
      return { room };
    }
  }
  return { error: 'Could not remove user from room' };
};

module.exports = { addRoom, removeRoom, getRooms, getRoom, addUserToRoom, removeUserFromRoom };
