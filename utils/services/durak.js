const cards = [
  // SPADES
  '6S',
  '7S',
  '8S',
  '9S',
  '10S',
  '11S',
  '12S',
  '13S',
  '14S',
  // HEARTS
  '6H',
  '7H',
  '8H',
  '9H',
  '10H',
  '11H',
  '12H',
  '13H',
  '14H',
  // DIAMONDS
  '6D',
  '7D',
  '8D',
  '9D',
  '10D',
  '11D',
  '12D',
  '13D',
  '14D',
  // CLUBS
  '6C',
  '7C',
  '8C',
  '9C',
  '10C',
  '11C',
  '12C',
  '13C',
  '14C',
];

const shuffleDeck = (array) => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const createDeck = (recievedUsers) => {
  const localcards = shuffleDeck(shuffleDeck([...cards]));
  const lastcard = localcards.slice(-1);
  let deck = { field: [], draft: [], cards: localcards, lastcard };
  let users = [];
  for (let i = 0; i < recievedUsers.length; i++) {
    let hand = deck.cards.splice(0, 6);
    let lowest = 99;

    hand.map((card) => {
      let cardChar = card.match(/[SHDC]/g).toString();
      let cardNum = parseInt(card.match(/[0-9]+/g));
      let lastcardChar = lastcard[0].match(/[SHDCU]/g).toString();
      if (cardChar === lastcardChar) {
        if (cardNum < lowest) {
          lowest = cardNum;
        }
      }
    });

    const user = {
      id: recievedUsers[i].id,
      username: recievedUsers[i].username,
      socket: recievedUsers[i].socket,
      hand,
      length: hand.length,
      status: 'other',
      lowest,
      finished: false,
    };
    users.push(user);
  }

  let first = 0;
  let lowest = users[first].lowest;

  for (let j = 1; j < users.length; j++) {
    if (users[j].lowest < lowest) {
      first = j;
      lowest = users[j].lowest;
    }
  }

  users = giveStatus(users, first);

  return { deck, users };
};

const giveStatus = (users, first) => {
  if (first === users.length) {
    first = 0;
  }

  users[first].status = 'attacking_1';

  if (first + 2 < users.length) {
    users[first + 1].status = 'defending';
    if (users.length > 2 && users[first + 2].hand.length !== 0) users[first + 2].status = 'attacking_2';
  } else if (first + 1 < users.length) {
    users[first + 1].status = 'defending';
    first = 0;
    if (users.length > 2 && users[first].hand.length !== 0) users[first].status = 'attacking_2';
  } else {
    first = 0;
    users[first].status = 'defending';
    if (users.length > 2 && users[first + 1].hand.length !== 0) users[first + 1].status = 'attacking_2';
  }

  return users;
};

const updateField = ({ room, durak }) => {
  room.users.map((user) => {
    let userhands = room.users.reduce((filtered, filteruser) => {
      if (filteruser.id !== user.id) {
        let someNewValue = { id: filteruser.id, username: filteruser.username, socket: filteruser.socket, handlength: filteruser.hand.length };
        filtered.push(someNewValue);
      }
      return filtered;
    }, []);

    durak.to(`/main#${user.socket}`).emit('handcards', {
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

const updateOrder = ({ room, durak }) => {
  const lostuser = room.users.filter((user) => user.hand.length !== 0);
  if (room.deck.cards.length === 0 && lostuser.length === 1) {
    room.users.map((user) => {
      durak.to(`/main#${user.socket}`).emit('finish-game', { lostuser: lostuser[0] });
    });
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
  updateField({ room, durak });
};

module.exports = { createDeck, updateField, updateOrder };
