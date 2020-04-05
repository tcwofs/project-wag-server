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

let deckIndex = 0;

const shuffleDeck = array => {
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

const createDeck = recievedUsers => {
  const localcards = shuffleDeck([...cards]);
  let deck = { id: ++deckIndex, field: [], draft: [], cards: localcards, lastcard: localcards.slice(-1) };
  let users = [];
  for (let i = 0; i < recievedUsers.length; i++) {
    hand = deck.cards.splice(0, 6);
    const user = { id: recievedUsers[i].id, username: recievedUsers[i].username, hand, length: hand.length, status: 'other' };
    users.push(user);
  }
  //TODO: find user index with lowest card and set attacking_1 to it
  users[0].status = 'attacking_1';
  if (users.length > 2) users[2].status = 'attacking_2';
  users[1].status = 'defending';
  return { deck, users };
};

module.exports = { createDeck };
