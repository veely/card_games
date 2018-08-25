"use strict";

require('dotenv').config();
// required packages and modules
const ENV         = process.env.ENV || "development";
const express = require('express');
const app = express();
const server = require('http').Server(app);
const PORT        = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);

const cookieSession = require("cookie-session");

app.use(express.static('public'))

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
  res.render("register")
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
  res.render("goofspielSessionList");
  // }
})

app.get("/games/goofspiel/new", function (req, res) {
  req.session.username = 'vincent';
  let templateVars = {
    username: req.session.username
  }
  res.render("newGoofspielGame", templateVars)
})

app.get("/games/goofspiel/:sessionID", function (req, res) {
  req.session.sessionID = req.params.sessionID;
  req.session.username = 'vincent'
  knex.select('username', 'hand')
    .from('players')
    .where({
      'session_id': req.params.sessionID,
      'username': req.session.username
    })
    .asCallback(function(err, rows) {
      let currentHand;
      for (let player of rows) {
        currentHand = player.hand
      }
      let templateVars = {
        currentHand: currentHand,
        username: req.session.username,
        sessionID: req.session.sessionID
      }
      res.render("goofspiel", templateVars);
      console.log(currentHand);
      console.log(rows);
    })
})



app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  //check that the username and password are in the system
  req.session.username = username;
  console.log("login worked");
  res.redirect("/");
})

app.post("/register", function (req, res) {
  const username = req.body.username
  // compare username to a list of database usernames, boolean if username exists
  // req.session.username = username;
  console.log("someone has registered", req.body)
})

app.post("/logout", function (req, res) {
  req.session.username = null;
  console.log("somebody logged out");
  res.redirect("/");
})

app.post("/goofspiel/newGameMove", function (req, res) {
  let cardPlayed = Object.keys(req.body)[0];
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
