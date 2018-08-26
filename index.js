"use strict";

require('dotenv').config();

const ENV         = process.env.ENV || "development";
const express     = require("express");
const sass        = require("node-sass-middleware");
const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
const app = express();
const server = require('http').Server(app);
const PORT        = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

const draw = require('./public/scripts/draw_cards');
const login = require('./public/scripts/login');
const register = require('./public/scripts/register');

app.use(express.static('public'));

app.use(
  cookieSession({
    name: "session",
    signed: false,
    maxAge: 24 * 60 * 60 * 1000
  })
);


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");



app.get("/", function (req, res) {
  let templateVars = {
    username: req.session.username
  }
  res.render("index", templateVars);
})

app.get("/register", function (req, res) {
  // let templateVars = {
  //   username: req.session.username
  // }
  res.render("RegistrationPage")
})

app.get("/players/:username", function (req, res) {
  let templateVars = {
    username: req.session.username
  }
  res.render("player-archive", templateVars)
})

app.get("/games/goofspiel", function (req, res) {
  // if (!req.session.username) {
  //   res.render("/");
  //   alert("You need to log in or register to play a game!")
  // }
  // else {
  // req.session.sessionID = null
  // let templateVars = {
  //   username: req.session.username,
  // }
  res.render("gespielSession");
  // }
})

app.get("/games/goofspiel/:sessionID", function (req, res) {
  knex.select('username', 'hand')
    .from('players')
    .where({
      'session_id': req.params.sessionID
    })
    .asCallback(function(err, rows) {
      console.log(rows);
    })

  // req.session.sessionID = req.params.sessionID;
  const username = req.session.username
  let templateVars = {
    username: username,
    sessionID: req.session.sessionID
  }
  // if (!req.session.username) {
  //   res.redirect("/")
  //   alert("You must log in to play the game!");
  // } else if (true) {
  // // check if the username is in the session's players
  //   res.redirect("/")
  //   alert("this is not your game!")
  // } else {
    res.render("goofspiel", templateVars)
  // }
})

app.post("/games/goofspiel/:sessionID", function (req, res) {
  let deck = req.body.deck;
  let playerOneHand = req.body.playerOneHand;
  let drawIndex = req.body.drawIndex;
  draw.drawCards(drawIndex, deck, playerOneHand).then( result => {
    console.log(result);
  });
  // .catch( err => {
  //   console.log(err);
  // });
  res.send(201);
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.passwordLogin;
  //check that the username and password are in the system
  login.login(username, password).then( result => {
    console.log(result);
    req.session.username = username;
    res.redirect("/");
  })
  .catch( err => {
    console.log(err);
    res.redirect("/");
  });
  // console.log("login worked");
})

app.post("/register", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  //check that the username and password are in the system
  register.register(username, password).then( result => {
    console.log(result);
    // req.session.username = username;
    res.redirect("/");
  })
  .catch( err => {
    console.log(err);
    res.redirect("/");
  });
})

app.post("/logout", function (req, res) {
  req.session.username = null;
  console.log("somebody logged out");
  res.redirect("/");
})


// // namespaces of different games
// const GS = io.of('/goofspiel')


// // goofspiel game
// // GS is your namespace, session ID will be the name of your rooms



// app.get("/games/goofspiel", function (req, res) {
//   // take session_ID cookie (value of submit button from the game page), match
//   res.render("goofspiel");
//   // if no match, alert ("this is not a game that you are a part of")
// })


// // socket variable is each socket connection
// GS.on('connection', function (socket) {
//   console.log('socket username cookie person has connected')

//   socket.on('disconnect')
// })

//Database Call

server.listen(PORT, function() {
  console.log(`Example app listening on port ${PORT}!`);
});
