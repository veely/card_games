const ENV         = process.env.ENV || "development";
const knexConfig  = require("../../knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const knexLogger  = require('knex-logger');

function drawCards(drawIndex, deck, hand) {
  return new Promise((resolve, reject) => {
    if (drawIndex < deck.length) {
      knex.select()
      .from('cards')
      .where({
        'rank': deck[drawIndex].rank,
        'suit': deck[drawIndex].suit
      })
      .asCallback(function(err, rows){
        if (err) return console.error(err);
        if (hand) {
          hand.push(rows[0]);
        } else {
          hand = [rows[0]];
        }
        drawIndex++;
        resolve(hand);
      });
    } else {
      reject("No more cards in deck!");
    }
  });
}

module.exports = {
  drawCards: drawCards
}

