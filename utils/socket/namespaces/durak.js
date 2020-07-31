const { getUser } = require('./users');
const { getRoom, removeRoom, removeUserFromRoom } = require('../../services/rooms');
const { createDeck, giveStatus } = require('../../services/durak');

module.exports = (io) => {
  const durak = io.of('/durak');
  durak.on('connection', (socket) => {
    console.log(`User ${socket.id} connected to a '/durak'!`);

    const user = getUser(socket.conn.id);

    if (!user) {
      socket.emit('error-redirect', { error: 'Error occured you will be redirected to home page' });
      return;
    }

    const allowStartGame = (room) => {
      const usersReady = room.users.filter((user) => user.ready === true);
      if (room.users.length > 1 && room.users.length === usersReady.length) {
        durak.in(`${room.id}_${room.roomname}`).emit('start-game');
        room.active = false;
        startGame(room);
      }
    };

    const startGame = (room) => {
      const { deck, users } = createDeck(room.users);
      room.deck = deck;
      room.users = users;
      updateField(room);
    };

    const updateField = (room) => {
      room.users.map((user) => {
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
          finished: user.finished,
        });
      });
    };

    const updateOrder = (room) => {
      const lostuser = room.users.filter((user) => user.hand.length !== 0);
      if (room.deck.cards.length === 0 && lostuser.length === 1) {
        durak.in(`${room.id}_${room.roomname}`).emit('finish-game', { lostuser: lostuser[0] });
      }
      const userDefenceIndex = room.users.findIndex((user) => user.status === 'defending');

      let first = 0;
      let draft = room.deck.field.filter((row) => row.length % 2 === 0).length === room.deck.field.length;
      let fieldcards = room.deck.field.splice(0);

      if (draft) {
        for (let i = 0; i < fieldcards.length; i++) {
          for (let j = 0; j < fieldcards[i].length; j++) {
            room.deck.draft.push(fieldcards[i][j]);
          }
        }
        first = userDefenceIndex;
      } else {
        for (let i = 0; i < fieldcards.length; i++) {
          for (let j = 0; j < fieldcards[i].length; j++) {
            room.users[userDefenceIndex].hand.push(fieldcards[i][j]);
          }
        }
        first = userDefenceIndex + 1;
      }

      const userswithoutcards = room.users.filter((user) => user.hand.length < 6);
      userswithoutcards.map((user) => {
        user.hand = user.hand.concat(room.deck.cards.splice(0, 6 - user.hand.length));
      });

      room.users.map((user) => {
        user.finished = false;
        user.status = 'other';
      });

      room.users = giveStatus(
        room.users.filter((user) => user.hand.length !== 0),
        first
      );
      updateField(room);
    };

    socket.on('connect-room', ({ roomname }) => {
      const { room } = getRoom({ roomname, type: 'durak' });
      socket.join(`${room.id}_${room.roomname}`);
      setInterval(() => socket.emit('get-room-users', { activeUsers: room.users }), 1000);
    });

    socket.on('user-ready', ({ roomname }) => {
      const { room } = getRoom({ roomname, type: 'durak' });
      const index = room.users.findIndex((user) => user.id === socket.conn.id);
      if (index !== -1) {
        room.users[index].ready = !room.users[index].ready;
        allowStartGame(room);
        return;
      }
      socket.emit('error-redirect', { error: 'Error occured you will be redirected to home page' });
    });

    socket.on('attack', ({ card, roomname, second }) => {
      const { room } = getRoom({ roomname, type: 'durak' });
      const userindex = room.users.findIndex((user) => user.id === socket.conn.id);
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
            updateField(room);
          }
        }
      }
    });

    socket.on('defence', ({ card, roomname }) => {
      const { room } = getRoom({ roomname, type: 'durak' });
      const userindex = room.users.findIndex((user) => user.id === socket.conn.id);
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
                  updateField(room);
                  break;
                }
              }
            }
          }
        }
      }
    });

    socket.on('finish-move', ({ roomname }) => {
      const { room } = getRoom({ roomname, type: 'durak' });
      const userindex = room.users.findIndex((user) => user.id === socket.conn.id);
      if (userindex !== -1) {
        room.users[userindex].finished = !room.users[userindex].finished;
      }
      const finishedUsers = room.users.filter((user) => user.finished === true);
      const actionUsers = room.users.filter((user) => user.status !== 'other');
      if (finishedUsers.length === actionUsers.length) {
        updateOrder(room);
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
