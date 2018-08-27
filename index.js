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

const sass        = require("node-sass-middleware");

const morgan      = require('morgan');
const knexLogger  = require('knex-logger');






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
  function findRankings () {
    return new Promise ((resolve, reject) => {
      knex.select('username', 'wins')
      .from('users')
      .asCallback ((err,rows) => {
        resolve(rows)
      })
    })
  }
  findRankings().then(result => {
    console.log(result)
    let templateVars = {
      username: req.session.username,
      playerRanking: JSON.stringify(result)
    }
    res.render("index", templateVars);
  })
})

app.get("/register", function (req, res) {
  let templateVars = {
    username: req.session.username
  }
  res.render("register", templateVars)
})

app.get("/players/:username", function (req, res) {
  let templateVars = {
    username: req.session.username
  }
  res.render("player-archive", templateVars)
})




app.get("/games/goofspiel", function (req, res) {
  if (req.session.username) {
    let username = req.session.username
    console.log("get working")
    // need to wrap this in another promise to find opponent username
    // need to find - sessionIDs with the game name goofspiel that you are in
    // opponent that you are facing
    // are you the host or not
    function getSessionData() {
      return new Promise ((resolve, reject) => {
        let subquery = knex('players')
        .join('game_sessions', 'players.session_id', '=', 'game_sessions.session_id')
        .select('game_sessions.session_id')
        .where({
          'username': username,
          'game_name': 'goofspiel'
        });
        knex.select('username', 'session_id', 'player_is_host')
        .from('players')
        .whereNot({
          'username': username
        })
        .whereIn(
          'session_id', subquery
        )
        .asCallback ((err, rows) => {
          console.log(rows, "are rows")
          resolve(rows)
        })
      })
    }
    getSessionData().then (result => {
      const SLGS = io.of("/sessionListGoofspiel")
      SLGS.once('connection', function(socket) {
        socket.join(String(username));
        SLGS.to(String(username)).emit('sessionData', result)
      })
      let templateVars = {
        username: req.session.username,
      }
      res.render("goofspielSessionList", templateVars)
    })
  }
})





function checkPlayerNotInHandArray (arr, username) {
  for (let player of arr) {
    if (username === player[0]) {
      return false;
    }
  } return true;
}

function arrLengthChecker (arr) {
  if (arr.length < 2) {
    return true
  } else {
    return false;
  }
}

// bothPlayersInfo = [['john', 3],['vincent', 2]];
function winningHandUser (arr) {
  if ((arr[0])[1] > (arr[1])[1]) {
    return ((arr[0])[0]);
  } else if ((arr[0])[1] < (arr[1][1])) {
    return ((arr[1])[0]);
  } else {
    return null;
  }
}



app.get("/games/goofspiel/new", function (req, res) {
  if (req.session.username) {
  //
  // // both players have played - not sure if this isn't working because hardcoded or because problem with
  // // clearing bothPlayersInfo

  // let bothPlayersInfo = [['john', 2],['vincent', 3]];



  // // you have played
  // let bothPlayersInfo = [['vincent', 3]];

  // // opponent has played
    let bothPlayersInfo = [['john', 3]];

  // // no players have played



    // let bothPlayersInfo = [];

    req.session.sessionID = 3;
    const username = req.session.username;
    const sessionID = req.session.sessionID;
    let templateVars = {
      username: req.session.username,
      sessionID: req.session.sessionID,
      bothPlayersInfo: bothPlayersInfo
    }
    res.render("newGoofspielGame", templateVars)
    const GSNew = io.of("/goofspielNew")
    GSNew.once('connection', function(socket) {
      socket.join(String(sessionID));
      GSNew.to(String(sessionID)).emit('newJoin', "You've joined a game!");
      GSNew.to(String(sessionID)).emit('playerInfo', [bothPlayersInfo, username])
      function processLatestCard () {
        return new Promise ((resolve, reject) => {
          socket.on('latestCard', function (from, msg) {
            let playedCardValue = Number(msg);
            let username = from;
            if (checkPlayerNotInHandArray(bothPlayersInfo, username)) {
              bothPlayersInfo.push([username, playedCardValue]);
            } else {
              console.log("this player has already played his hand")
            }
            console.log(bothPlayersInfo, "this is bothPlayersInfo");
            resolve(bothPlayersInfo);
          })
        })
      }
      processLatestCard().then((result) => {
        console.log("latest card sent")
        if (bothPlayersInfo.length === 2) {
          let winner = winningHandUser(result);
          if (winner === null) {
            // deal with ties here
            GSNew.to(String(sessionID)).emit('resolvedHands', 0)
          } else {
            GSNew.to(String(sessionID)).emit('resolvedHands', winner)
          }
        }
      })
      socket.on('clearPlayerInfo', function (from, msg) {
        if (msg) {
          bothPlayersInfo = []
          console.log(bothPlayersInfo, "updated version")
        }
      })
    });
  } else {
    res.redirect('/')
  }
})




app.get("/games/goofspiel/:sessionID", function (req, res) {
  if (req.session.username) {
    req.session.sessionID = req.params.sessionID;
    console.log("opponent has played the card 3")
    let bothPlayersInfo = [['john', 3]];
    let sessionID = req.session.sessionID;
    let username = req.session.username;
    console.log(username, sessionID, "user and id check")

    let templateVars = {
      username: username,
      sessionID: sessionID
    }
    res.render("existingGoofspielGame", templateVars)

    const GSSession = io.of("goofspielSession")
    function getHandFromDb () {
      return new Promise ((resolve, reject) => {
        knex.select('hand')
        .from('players')
        .where({
          'username': username,
          'session_id': sessionID
        })
        .asCallback ((err, rows) => {

          resolve(rows)
        })
      })
    }
    GSSession.once('connection', function(socket) {
      socket.join((String(sessionID)))
      GSSession.to(String(sessionID)).emit('reJoin', "You've rejoined your game!");
      console.log("you've rejoined the game")
      getHandFromDb().then(result => {
        console.log(result, "type is: ", typeof result, Array.isArray(result))

        function returnHandArrayAsString (answer) {
          for (let match of answer) {
            return (match.hand.slice(1,match.hand.length - 1))
          }
        }
        let handArray = returnHandArrayAsString(result).split(", ");
        GSSession.to(String(sessionID)).emit('previousHandArray', handArray)
      }) .then(result => {
        console.log('then worked')

        function processLatestCard () {
          return new Promise ((resolve, reject) => {
            socket.on('latestCard', function (from, msg) {
              let playedCardValue = Number(msg);
              let username = from;
              if (checkPlayerNotInHandArray(bothPlayersInfo, username)) {
                bothPlayersInfo.push([username, playedCardValue]);
              } else {
                console.log("this player has already played his hand")
              }
              console.log(bothPlayersInfo, "this is bothPlayersInfo");
              resolve(bothPlayersInfo);
            })
          })
        }
        GSSession.to(String(sessionID)).emit('playerInfo', [bothPlayersInfo, username])
        processLatestCard().then((result) => {
          console.log("latest card sent")
          if (bothPlayersInfo.length === 2) {
            let winner = winningHandUser(result);
            if (winner === null) {
              // deal with ties here
              GSSession.to(String(sessionID)).emit('resolvedHands', 0)
            } else {
              GSSession.to(String(sessionID)).emit('resolvedHands', winner)
            }
          }
        })
        socket.on('clearPlayerInfo', function (from, msg) {
          if (msg) {
            bothPlayersInfo = []
            console.log(bothPlayersInfo, "updated version")
          }
        })
      })
    })
  } else {
    res.redirect("/");
  }
})


// app.post("/games/goofspiel/:sessionID", function (req, res) {
//   let deck = req.body.deck;
//   let playerOneHand = req.body.playerOneHand;
//   let drawIndex = req.body.drawIndex;
//   draw.drawCards(drawIndex, deck, playerOneHand).then( result => {
//     console.log(result);
//   });
//   // .catch( err => {
//   //   console.log(err);
//   // });
//   res.send(201);
// });

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.passwordLogin;
  //check that the username and password are in the system
  login.login(username, password).then( result => {
    console.log(result);
    console.log(username, "logged in")
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
    req.session.username = username;
    res.redirect("/");
  })
  .catch( err => {
    console.log(err);
    res.redirect("/");
  });
})

app.post("/logout", function (req, res) {
  req.session = null;
  console.log("somebody logged out");
  res.redirect("/");
})


app.post("/goofspiel/:sessionID/save", function(req, res) {

  // !!!!!!!!
  // req.body is an object with your hand array and the prize array
  // need to dynamically remove the card that you played
  // from myHandArray so you're sending the right array over after a card has been played

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



server.listen(PORT, function() {
  console.log(`Example app listening on port ${PORT}!`);
});

