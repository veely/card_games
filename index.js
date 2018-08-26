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
  // need to wrap this in another promise to find opponent username
  function getMatchingSessions () {
    return new Promise ((resolve, reject) => {
        knex.select('session_id')
          .from('players')
          .where({
            'username': username
          })
          .asCallback (function (err, rows) {
            // console.log(rows)
            let sessionIDArr = []
            for (let eachInstance of rows) {
              sessionIDArr.push(eachInstance.session_id);
            }
            resolve (sessionIDArr)
          })


    })
  }
  getMatchingSessions()
    .then((result) => {
      let sessionsArr = result;
      console.log(sessionsArr, "sessionArr")
      let opponentArr = []
      // function populateOppArr () {
      //   return new Promise ((resolve, reject) => {
      //     for (let eachSession of sessionsArr) {
      //       knex.select('username', 'session_id')
      //         .from('players')
      //         .where({
      //           'session_id': eachSession
      //         })
      //         .whereNot({
      //           'username': username
      //         })
      //         .asCallback (function (err, rows) {
      //           for (let eachOpponent of rows) {
      //             opponentArr.push(eachOpponent);
      //           } if (opponentArr.length === sessionsArr.length) {
      //             console.log(opponentArr, "f9na")
      //           }
      //         })
      //     }
      //   })
      // }
      // populateOppArr()
      //   .then((result) => {
      //     console.log(result);
      //   })
    })




//   getPlayersMatchingSession()
//     .then((result) => {
// // result is array of session ID
//       function()
//       for (let eachSession of result) {
//         knex.select('username', 'session_id')
//           .from('players')
//           .whereNOT({
//             'username': username
//           })
//           .asCallback (function (err, rows) {
//             console.log(rows, "these are the opponents")
//           })
//       }
//     })



      // let templateVars = {
      //   username: username,
      //   sessionIDRows: result,

      // }
  // function createTemplateVars () {
  //   let playerInfoArray = getPlayersMatchingSession()
  //   console.log(playerInfoArray, typeof playerInfoArray)
  //   // for (let eachPlayer of playerInfoArray) {
  //   //   console.log(eachPlayer.session_id)
  //   // }
  // }
  // createTemplateVars()



    // let templateVars = {
    //   username: username,
    //   opponentUsername: rowstuff[0].username,
    //   session_id: rowstuff[0].session_id
    // }
    res.render("goofspielSessionList")
    // , templateVars)
})

//     .asCallback (function(err, rows){
//       for (let session of rows) {
//         let sessionLoad = session.session_id
//         knex.select('username', 'session_id')
//           .from('players')
//           .where({
//             'session_id': sessionLoad
//           })
//           .whereNot ({
//             'username': username
//           })
//           .asCallback (function(err, rows) {
//             req.session.session_id = null
//             let templateVars = {
//               username: username,
//               opponentUsername: rows[0].username,
//               session_id: rows[0].session_id
//             }
//             res.render("goofspielSessionList", templateVars)
//           });
//       }
//     });
//   // res.render("goofspielSessionList", templateVars)
// // may have to look into promises, error for not being able to set headers after they are sent
// });



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

// bothPlayersInfo = [['andrew', 3],['vincent1', 2]];
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



  // // both players have played - not sure if this isn't working because hardcoded or because problem with
  //clearing bothPlayersInfo

  // let bothPlayersInfo = [['andrew', 2],['vincent1', 3]];



  // // you have played
  // let bothPlayersInfo = [['vincent1', 3]];

  // // opponent has played
  // let bothPlayersInfo = [['andrew', 3]];

  // // no players have played
  let bothPlayersInfo = [];

  req.session.username = 'vincent1';
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
            console.log(bothPlayersInfo, "arr", username)
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
})



app.get("/games/goofspiel/:sessionID", function (req, res) {
  req.session.sessionID = req.params.sessionID;
  req.session.username = 'vincent'
  let sessionID = req.session.sessionID;
  let username = req.session.username;
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
        username: username,
        sessionID: sessionID
      }
      res.render("goofspiel", templateVars);
      console.log(currentHand);
      console.log(rows);
    })
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



server.listen(PORT, function() {
  console.log(`Example app listening on port ${PORT}!`);
});

