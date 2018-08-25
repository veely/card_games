"use strict";

require('dotenv').config();
// required packages and modules
const ENV             = process.env.ENV || "development";
const express         = require('express');
const app             = express();
const server          = require('http').createServer(app);
const io              = require ('socket.io').listen(server);
const PORT            = process.env.PORT || 8080;
const bodyParser      = require("body-parser");
const knexConfig      = require("./knexfile");
const knex            = require("knex")(knexConfig[ENV]);
const cookieSession   = require("cookie-session");


server.listen(PORT, function() {
  console.log(`Example app listening on port ${PORT}!`);
});



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
  req.session.username = 'vincent';
  let username = req.session.username
  knex.select('session_id')
    .from('players')
    .where({
      'username': username
    })
    .asCallback (function(err, rows){
      for (let session of rows) {
        let sessionLoad = session.session_id
        knex.select('username', 'session_id')
          .from('players')
          .where({
            'session_id': sessionLoad
          })
          .whereNot ({
            'username': username
          })
          .asCallback (function(err, rows) {
            req.session.session_id = null
            let templateVars = {
              username: username,
              opponentUsername: rows[0].username,
              session_id: rows[0].session_id
            }
            res.render("goofspielSessionList", templateVars)
          });
      }
    });
  // res.render("goofspielSessionList", templateVars)
// may have to look into promises, error for not being able to set headers after they are sent
});
/////////CHECKOUT HERE

// io.on('connection', function (socket) {
//   io.emit('server', "hi this is the server message");

//   socket.on('gameBoard', function (from, msg) {
//     console.log('I received a private message by ', from, ' saying ', msg);
//   });

// });




app.get("/games/goofspiel/new", function (req, res) {
  req.session.username = 'vincent';
  req.session.sessionID = 3
  let templateVars = {
    username: req.session.username,
    sessionID: req.session.sessionID
  }
  res.render("newGoofspielGame", templateVars)

  let GSNew = io.of("/goofspielNew")
  GSNew.on('connection', function(socket) {
    GSNew.emit('newJoin', "You've joined a game!");

    socket.on('latestCard', function (from, msg) {
      console.log(`the latest card ${msg} is from ${from}`)
    })
  })




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






