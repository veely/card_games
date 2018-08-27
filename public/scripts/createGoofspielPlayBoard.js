"use strict";

const myHand = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const prizeCards = [['A', 1], ['2', 2], ['3', 3], ['4', 4], ['5', 5], ['6', 6], ['7', 7], ['8', 8], ['9', 9], ['10', 10], ['J', 11], ['Q', 12], ['K', 13]];

let gamePrize = shuffleCards(prizeCards)


// variables for scoreboard
let score1 = 0;
let score2 = 0;

// variable for prize card
let cardValue;

let clearMsg;
// variable for number of hand cards
let cardCount = 13
let myCardCount = 13

// function that randomly shuffles an array of playing cards
function shuffleCards (arr) {
  for (let i = arr.length - 1; i > 0 ; i --) {
    const j = Math.floor(Math.random() * (i + 1));
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}


// functions for creating hands

function createOpponentHand () {
  // let oppHandCode = `<div class="oppHand">`
  // for (let count = 0; count < cardCount; count ++) {
  //   oppHandCode += `<button class="card">Card</button>\n`
  // };
  // oppHandCode += "</div>";
  let oppHandCode = `
  <button id="ace2" class="card" value="1"></button>
  <button id="two2" class="card" value="2"></button>
  <button id="three2" class="card" value="3"></button>
  <button id="four2" class="card" value="4"></button>
  <button id="five2" class="card" value="5"></button>
  <button id="six2" class="card" value="6"></button>
  <button id="seven2" class="card" value="7"></button>
  <button id="eight2" class="card" value="8"></button>
  <button id="nine2" class="card" value="9"></button>
  <button id="ten2" class="card" value="10"></button>
  <button id="jack2" class="card" value="11"></button>
  <button id="queen2" class="card" value="12"></button>
  <button id="king2" class="card" value="13"></button>
  `;
  return oppHandCode;
};


function createMyHand () {
  let myHandCode = `
  <button id="ace1" class="card" value="1"></button>
  <button id="two1" class="card" value="2"></button>
  <button id="three1" class="card" value="3"></button>
  <button id="four1" class="card" value="4"></button>
  <button id="five1" class="card" value="5"></button>
  <button id="six1" class="card" value="6"></button>
  <button id="seven1" class="card" value="7"></button>
  <button id="eight1" class="card" value="8"></button>
  <button id="nine1" class="card" value="9"></button>
  <button id="ten1" class="card" value="10"></button>
  <button id="jack1" class="card" value="11"></button>
  <button id="queen1" class="card" value="12"></button>
  <button id="king1" class="card" value="13"></button>
  `;
  return myHandCode
}

function renderMyHand() {
  let $myHand = createMyHand();
  $('.myHandContainer').append($myHand);
}

function renderOppHand() {
  let $oppHand = createOpponentHand();
  $('.oppHandContainer').append($oppHand);
}

// functions for making prize cards



function removeLastPrize () {
  if (gamePrize.length > 0) {
    gamePrize = gamePrize.slice(0, gamePrize.length - 1)
  } console.log(gamePrize)
}

function findLastPrize () {
  if (gamePrize.length > 0) {
    let lastPrizeArr =  gamePrize[gamePrize.length - 1]
    return lastPrizeArr[1]
  }
}


function findKey (obj) {
  return Object.keys(obj)[0]
}

function createPrizeCard (arr) {
  if (arr.length !== 0) {
    let lastIndex = arr.length - 1
    let cardArr = arr[lastIndex]
    let cardText = cardArr[0]
    cardValue = cardArr[1]
    var prizeHTML = `<h1 class="new-prize-hand">${cardText}</h1>`;
    console.log(cardArr)
    console.log(cardValue);
    console.log(cardText);
    return prizeHTML;
  } else {
    return "";
  }
}

function renderPrizeCards() {
  let $prizeCard = createPrizeCard(gamePrize)
  $('.prizeHandContainer').append($prizeCard);
}


// functions for scoring

function renderScoreBoard() {
  let $scoreString = `<h1 class="scoreboard">Score: ${score1}:${score2}</h1>`;
  $('.scoreboardContainer').append($scoreString);
}

// helper functions for rendering new and updated board states
function newBoardState () {
  renderScoreBoard();
  renderMyHand();
  renderOppHand();
  renderPrizeCards();
}

// update board after comparing hands
function updateOppHand() {
  cardCount -- ;
  $(".oppHand").remove();
  renderOppHand();
}


function updateBoardState () {
  $(".new-prize-hand").remove();
  renderPrizeCards;
}

// add conditional for comparing cardvalue to p2 before adding score
// make a database for recording player archive data (who y)
// when score on both sides add up to 91, game ends, player archive data is recorded, player wins is updated

function checkPlayerInHandArray (arr, username) {
  if (arr === []) {
    return false;
  } else {
    for (let player of arr) {
      if (username === player[0]) {
        return true;
      }
    } return false;
  }
}

$(document).ready(function() {
  function changeMyHand () {
    myCardCount --;
  }
  // const $bothPlayersInfo = $("#sessionBothPlayersInfo")
  // const $username = $("#sessionUsername")
  // console.log(($bothPlayersInfo).split(','))
  // console.log(typeof $username)
  let username;
  const socket = io.connect('/goofspielNew');
  newBoardState();
  socket.on('newJoin', function (data) {
    console.log(data);
  });
  console.log(cardValue, "hi")
  function resolveHands() {
    return new Promise ((resolve, reject) => {
      socket.on('resolvedHands', function(data) {
        if (data === null) {
          console.log('tie')
          // program for  tie
          //
          //
        } else {
          function updateScore() {
            if (data === username) {
              console.log(score1, "cool", cardValue)
              score1 += findLastPrize()
            } else {
              score2 += findLastPrize()
            }
            $(".scoreboard").remove();

            renderScoreBoard();
          }
          cardCount --
          updateOppHand();
          updateScore();
          resolve("completed resolving")
        }
      })
    })
  }
  function findarrLength () {
    return new Promise((resolve, reject) => {
      socket.on('playerInfo', function(data) {
        resolve(data)
        console.log(data, 'playerInfo')
      })
    })
  }
  findarrLength().then((result) => {
    username = result[1]
    console.log(result)
    if ((result[0].length !== 2) && (!checkPlayerInHandArray(result[0], username))) {
      // && (cardCount === myCardCount)
      $(".card").click(function() {
          let $cardValue = ($(this).val());
          function latestCardSent () {
            socket.emit('latestCard', username, $cardValue);
            $(this).remove()
          }
          latestCardSent()
          resolveHands()
            .then(result => {
              $(this).remove();
              removeLastPrize();
              updateBoardState();
              renderPrizeCards();
              clearMsg = 1;
              socket.emit('clearPlayerInfo', 'mod', clearMsg);
            })
            .catch(err => {
              console.log(err)
            })
        // }
      })
      // !!!!! see if you need this else if statement for dealing with arrays that are already full
    // }
    // else if (result[0].length === 2) {
    //   $(".card").click(function() {
    //     resolveHands()
    //       .then(result =>) {
    //         removeLastPrize();
    //         updateBoardState
    //       }
    //   }
    }
    else {
      $(".card").click(function() {
        console.log("wait for your opponent");
      })
    }
  })
   .catch((err) => {
    console.log(err);
  })
});






// data[0] is bothPlayersInfo [['andrew', 3],['vincent1', 2]]
// data[1] is username

  //   if (result[0] !== 2 && )

  //    {
  //     $(".card").click(function() {
  //       $(this).remove();
  //       let $cardValue = ($(this).val());
  //       updateBoardState();
  //       socket.emit('latestCard', "player", $cardValue);
  //       console.log("your card value has been sent")
  //     })
  //   } else {
  //     console.log("wait for your opponent")
  //   }

  // if ($bothPlayersInfo.length < 2 && !checkPlayerInHandArray($bothPlayersInfo, $username)) {
  // } else {
  //   console.log("wait for your opponent")
  // }




  // var socket = io.connect('http://localhost:8080');
  // socket.on('server', function (data) {
  //   console.log(data);
  //   socket.emit('gameBoard', "gamsession","hi, this is the game message");
  // });





