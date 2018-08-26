$(document).ready(function() {

  const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const suits = ['diamonds', 'clubs', 'hearts', 'spades'];
  const deck = (createDeck(cards, suits, shuffleDeck));
  let drawIndex = 0;
  let playerOneHand = [];

  $("#drawCard").click(function() {
    // $.post("/games/goofspiel/:sessionID", { drawIndex: drawIndex, deck: deck, playerOneHand: playerOneHand })
    drawIndex++;
  })
});
