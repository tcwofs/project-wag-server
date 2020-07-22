let deckIndex = 0;

const createDeck = recievedUsers => {
  let deck = { id: ++deckIndex, field: [[' ', ' ', ' '],[' ', ' ', ' '],[' ', ' ', ' ']], };
  let users = [];
  for (let i = 0; i < recievedUsers.length; i++) {
    const user = {
      id: recievedUsers[i].id,
      username: recievedUsers[i].username,
      status: 'other'
    };
    users.push(user);
  }

  users = giveStatus(users, 0);

  return { deck, users };
};

const giveStatus = (users, first) => {
  users[first].status = 'attacking';

  if (first + 1 >=  users.length) {
    users[first-1].status = 'other';
  } else {
    users[first+1].status = 'other';
  }

  return users;
};

module.exports = { createDeck, giveStatus };
