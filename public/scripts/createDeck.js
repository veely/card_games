function shuffle(deck) {
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

// standard 52 card deck
function createDeck(cards, suits) {
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
  return cardDeck;
}

let cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let suits = ['diamonds', 'clubs', 'hearts', 'spades'];

let cardDeck = createDeck(cards, suits);
let shuffledDeck = shuffle(cardDeck);
console.log(shuffledDeck);