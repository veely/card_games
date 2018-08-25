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

function drawCards(drawIndex, deck) {
  return new Promise((resolve, reject) => {
    if (drawIndex < deck.length) {
      let num = playerOneHand.length;
      knex.select()
      .from('cards')
      .where({
        'rank': deck[drawIndex].rank,
        'suit': deck[drawIndex].suit
      })
      .asCallback(function(err, rows){
        if (err) return console.error(err);
        playerOneHand.push(rows[0]);
        drawIndex++;
        knex.destroy();
        resolve(true);
      });
    } else {
      knex.destroy();
      reject("No more cards in deck!");
    }
  });
}

// drawCards().then( result => {
//   // do something after drawing card
//   console.log(playerOneHand);
// })
// .catch(err => {
//   console.log("Error:", err);
// });

// module.exports = {
//   draw: drawCards
// }
