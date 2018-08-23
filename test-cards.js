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

let deck = require('./public/scripts/createDeck');

let drawIndex = 0;

knex.select()
.from('game_sessions')
.asCallback(function(err, rows){
  if (err) return console.error(err);
  console.log(rows);
  knex.destroy();
});
