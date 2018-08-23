const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits = ['diamonds', 'clubs', 'hearts', 'spades'];

function shuffleDeck(deck) {
  let currentIndex = deck.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = deck[currentIndex];
    deck[currentIndex] = deck[randomIndex];
    deck[randomIndex] = temporaryValue;
  }
  return deck;
}

// standard 52-card deck
function createDeck(cards, suits, callback) {
  let cardDeck = [];
  for (let card of cards) {
    for (let suit of suits) {
      cardDeck.push(
        {
          rank: card,
          suit: suit
        }
      );
    }
  }
  let shuffledDeck = callback(cardDeck);
  return shuffledDeck;
}

module.exports = {
  createDeck: createDeck(cards, suits, shuffleDeck)
};
