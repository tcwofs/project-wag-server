const { removeUserFromAllRoom, getRoomByID } = require('../../services/rooms');
const { updateField, updateOrder, createDeck } = require('../../services/durak');
const { getUser } = require('../../services/users');

module.exports = (io) => {
  const durak = io.of('/main');
  durak.on('connection', (socket) => {
    console.log(`User ${socket.id} connected to a '/durak'!`);

    socket.on('attack', ({ card, roomId, second }) => {
      const { room } = getRoomByID({ roomId });
      const userindex = room.users.findIndex((user) => user.socket === socket.conn.id);
      if (room.deck.field.length === 6) return;
      if (
        room.users.filter((user) => user.status === 'defending' && room.deck.field.filter((row) => row.length % 2 !== 0).length === user.hand.length)
          .length !== 0
      )
        return;
      if (userindex !== -1) {
        const cardindex = room.users[userindex].hand.findIndex((delcard) => delcard === card);
        if (cardindex !== -1) {
          let result = [];
          if (room.deck.field.length) {
            result = room.deck.field.reduce((result, element) => {
              let cardNum = card.match(/[0-9]+/g);
              let fieldNum0 = element[0].match(/[0-9]+/g);
              let fieldNum1 = ['0'];
              if (element.length === 2) fieldNum1 = element[1].match(/[0-9]+/g);

              if (fieldNum0[0] === cardNum[0] || fieldNum1[0] === cardNum[0]) {
                result.push(element);
              }
              return result;
            }, []);
          }

          if ((second && room.deck.field.length && result.length) || ((result.length || !room.deck.field.length) && !second)) {
            room.deck.field.push([card]);
            room.users[userindex].hand.splice(cardindex, 1)[0];
            room.users.map((user) => (user.finished = false));
            updateField({ room, durak });
          }
        }
      }
    });

    socket.on('defence', ({ card, roomId }) => {
      const { room } = getRoomByID({ roomId });
      const userindex = room.users.findIndex((user) => user.socket === socket.conn.id);
      if (userindex !== -1) {
        const cardindex = room.users[userindex].hand.findIndex((delcard) => delcard === card);
        if (cardindex !== -1) {
          if (room.deck.field.length) {
            for (let i = 0; i < room.deck.field.length; i++) {
              if (room.deck.field[i].length === 1) {
                let cardNum = parseInt(card.match(/[0-9]+/g));
                let fieldNum = parseInt(room.deck.field[i][0].match(/[0-9]+/g));
                let cardChar = card.match(/[SHDC]/g).toString();
                let fieldChar = room.deck.field[i][0].match(/[SHDC]/g).toString();
                if (
                  (cardChar === fieldChar && cardNum > fieldNum) ||
                  (cardChar !== fieldChar && cardChar === room.deck.lastcard[0].match(/[SHDC]/g).toString())
                ) {
                  room.deck.field[i].push(card);
                  room.users[userindex].hand.splice(cardindex, 1)[0];
                  room.users.map((user) => (user.finished = false));
                  updateField({ room, durak });
                  break;
                }
              }
            }
          }
        }
      }
    });

    socket.on('finish-move', ({ roomId }) => {
      const { room } = getRoomByID({ roomId });
      const userindex = room.users.findIndex((user) => user.socket === socket.conn.id);
      if (userindex !== -1) {
        room.users[userindex].finished = !room.users[userindex].finished;
      }
      const finishedUsers = room.users.filter((user) => user.finished === true);
      const actionUsers = room.users.filter((user) => user.status !== 'other');
      if (finishedUsers.length === actionUsers.length) {
        updateOrder({ room, durak });
      }
    });

    socket.on('play-again', ({ roomId }) => {
      const { room } = getRoomByID({ roomId });
      const userindex = room.users.findIndex((user) => user.socket === socket.conn.id);
      if (userindex !== -1) {
        room.users[userindex].start = true;
      }
      if (
        room.users.filter((item) => item.start === true).length > 1 &&
        room.users.filter((item) => item.start === true).length === room.users.length
      ) {
        room.users.map((item) => {
          durak.to(`/main#${item.socket}`).emit('play-again');
          const { deck, users } = createDeck(room.users);
          room.deck = deck;
          room.users = users;
          setTimeout(() => {
            updateField({ room, durak });
          }, 500);
        });
      }
    });

    socket.on('durak-leave', () => {
      const user = getUser({ socket: socket.conn.id });
      removeUserFromAllRoom({ user, durak });
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} left '/durak'!`);
      const user = getUser({ socket: socket.conn.id });
      removeUserFromAllRoom({ user, durak });
    });
  });
};
