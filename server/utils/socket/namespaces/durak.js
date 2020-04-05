const { getUser } = require('../users');
const { getRoom, removeRoom, removeUserFromRoom } = require('../rooms');
const { createDeck } = require('../../services/durak');

module.exports = io => {
  const durak = io.of('/durak');
  durak.on('connection', (socket, callback) => {
    console.log(`User ${socket.id} connected to a '/durak'!`);

    const user = getUser(socket.conn.id);

    if (!user) {
      socket.emit('error-redirect', { error: 'Error occured you will be redirected to home page' });
      return;
    }

    const updatedField = room => {
      room.users.map(user => {
        let userhands = room.users.reduce((filtered, filteruser) => {
          if (filteruser.id !== user.id) {
            let someNewValue = { id: filteruser.id, username: filteruser.username, handlength: filteruser.hand.length };
            filtered.push(someNewValue);
          }
          return filtered;
        }, []);

        durak.to(`/durak#${user.id}`).emit('handcards', {
          recievedUserhand: user.hand,
          allcards: {
            field: room.deck.field,
            lastcard: room.deck.lastcard,
            cardcount: room.deck.cards.length,
          },
          userhands,
          status: user.status,
        });
      });
      // console.log(room);
    };

    const allowStartGame = room => {
      const usersReady = room.users.filter(user => user.ready === true);
      if (room.users.length > 1 && room.users.length === usersReady.length) {
        durak.in(`${room.id}_${room.roomname}`).emit('start-game');
        room.active = false;
        startGame(room);
      }
    };

    const startGame = room => {
      const { deck, users } = createDeck(room.users);
      room.deck = deck;
      room.users = users;
      updatedField(room);
    };

    socket.on('connect-room', ({ roomname }) => {
      const { room } = getRoom({ roomname, type: 'durak' });
      socket.join(`${room.id}_${room.roomname}`);
      getUsersTimer = setInterval(() => socket.emit('get-room-users', { activeUsers: room.users }), 1000);
    });

    socket.on('user-ready', ({ roomname }) => {
      const { room } = getRoom({ roomname, type: 'durak' });
      const index = room.users.findIndex(user => user.id === socket.conn.id);
      if (index !== -1) {
        room.users[index].ready = true;
        allowStartGame(room);
        return;
      }
      socket.emit('error-redirect', { error: 'Error occured you will be redirected to home page' });
    });

    socket.on('attack', ({ card, roomname, second }) => {
      const { room } = getRoom({ roomname, type: 'durak' });
      const userindex = room.users.findIndex(user => user.id === socket.conn.id);
      if (room.deck.field.length === 6) return;
      if (userindex !== -1) {
        const cardindex = room.users[userindex].hand.findIndex(delcard => delcard === card);
        if (cardindex !== -1) {
          let result = [];
          if (!!room.deck.field.length) {
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
            const newhand = room.users[userindex].hand.splice(cardindex, 1)[0];
            updatedField(room);
          }
        }
      }
    });

    socket.on('defence', ({ card, roomname }) => {
      const { room } = getRoom({ roomname, type: 'durak' });
      const userindex = room.users.findIndex(user => user.id === socket.conn.id);
      if (userindex !== -1) {
        const cardindex = room.users[userindex].hand.findIndex(delcard => delcard === card);
        if (cardindex !== -1) {
          if (!!room.deck.field.length) {
            for (let i = 0; i < room.deck.field.length; i++) {
              if (room.deck.field[i].length === 1) {
                let cardNum = card.match(/[0-9]+/g);
                let fieldNum = room.deck.field[i][0].match(/[0-9]+/g);
                let cardChar = card.match(/[SHDC]/g);
                let fieldChar = room.deck.field[i][0].match(/[SHDC]/g);

                if (cardChar.source === fieldChar.source) {
                  console.log('xd1');
                  if (parseInt(cardNum) > parseInt(fieldNum)) {
                    console.log('xd2');
                    room.deck.field[i].push(card);
                    const newhand = room.users[userindex].hand.splice(cardindex, 1)[0];
                    updatedField(room);
                    break;
                  }
                }
                if (cardChar[0] === room.deck.lastcard[0].match(/[SHDC]/g)[0]) {
                  room.deck.field[i].push(card);
                  const newhand = room.users[userindex].hand.splice(cardindex, 1)[0];
                  updatedField(room);
                  break;
                }
              }
            }
          }
        }
      }
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} left '/durak'!`);
      const { error, room, user } = removeUserFromRoom({ id: socket.conn.id });
      if (!error) {
        socket.leave(`${room.id}_${room.roomname}`);
        durak.in(`${room.id}_${room.roomname}`).emit('finish-game', { lostuser: user });
        if (room.users.length === 0) {
          removeRoom(room.id);
        }
      }
    });
  });
};
