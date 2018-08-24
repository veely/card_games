require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

const deck = require('./public/scripts/createDeck').deck;
let drawIndex = 0;

let playerOneHand = [];
let playerTwoHand = [];


//draw 5 cards for player 1
function drawCards(numberOfCards) {
  return new Promise((resolve, reject) => {
    if (drawIndex < deck.length) {
      for (let i = 0; i < numberOfCards ; i++) {
        knex.select()
        .from('cards')
        .where({
          'rank': deck[drawIndex].rank,
          'suit': deck[drawIndex].suit
        })
        .asCallback(function(err, rows){
          if (err) return console.error(err);
          playerOneHand.push(rows[0]);
          knex.destroy();
          console.log(i);
        });
      }
      resolve(numberOfCards);
    } else {
      reject("No more cards in deck!");
    }
  });
}

drawCards(5).then( result => {
  drawIndex += 5;
  console.log(playerOneHand);
});
//draw 5 cards for player 2
// if (drawIndex < deck.length) {
//   for (let i = 0; i < 5; i++) {
//     knex.select()
//     .from('cards')
//     .where({
//       'rank': deck[drawIndex].rank,
//       'suit': deck[drawIndex].suit
//     })
//     .asCallback(function(err, rows){
//       if (err) return console.error(err);
//       playerTwoHand.push(rows[0]);
//       console.log("Player 2's hand: ", playerTwoHand);
//       knex.destroy();
//     });
//     drawIndex++;
//   }
// }



//draw 5 cards for player 1
// if (drawIndex < deck.length) {
//   for (let i = 0; i < 5; i++) {
//     knex.select()
//     .from('cards')
//     .where({
//       'rank': deck[drawIndex].rank,
//       'suit': deck[drawIndex].suit
//     })
//     .asCallback(function(err, rows){
//       if (err) return console.error(err);
//       playerOneHand.push(rows[0]);
//       knex.destroy();
//     });
//     drawIndex++;
//   }
//       console.log("Player 1's hand: ", playerOneHand);
// }

// //draw 5 cards for player 2
// if (drawIndex < deck.length) {
//   for (let i = 0; i < 5; i++) {
//     knex.select()
//     .from('cards')
//     .where({
//       'rank': deck[drawIndex].rank,
//       'suit': deck[drawIndex].suit
//     })
//     .asCallback(function(err, rows){
//       if (err) return console.error(err);
//       playerTwoHand.push(rows[0]);
//       console.log("Player 2's hand: ", playerTwoHand);
//       knex.destroy();
//     });
//     drawIndex++;
//   }
// }

