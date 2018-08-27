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
  let oppHandCode = `<div class="oppHand">`
  for (let count = 0; count < cardCount; count ++) {
    oppHandCode += `<button class="card">Card</button>\n`
  };
  oppHandCode += "</div>";
  return oppHandCode;
};


function createMyHand () {
  let myHandCode = `
  <button type="submit" class='card' value="1">A</button>
  <button type="submit" class='card' value="2">2</button>
  <button type="submit" class='card' value="3">3</button>
  <button type="submit" class='card' value="4">4</button>
  <button type="submit" class='card' value="5">5</button>
  <button type="submit" class='card' value="6">6</button>
  <button type="submit" class='card' value="7">7</button>
  <button type="submit" class='card' value="8">8</button>
  <button type="submit" class='card' value="9">9</button>
  <button type="submit" class='card' value="10">10</button>
  <button type="submit" class='card' value="11">J</button>
  <button type="submit" class='card' value="12">Q</button>
  <button type="submit" class='card' value="13">K</button>
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
    var prizeHTML = `<h1 class="new-prize-hand sessionHeader">Next Prize Card is ${cardText}</h1>`;
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
  let $scoreString = `<h1 class="scoreboard sessionHeader">Score is currently P1 ${score1} : P2 ${score2}</h1>`;
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
  cardCount --
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
  console.log("opponent has played the card 3")
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
          updateOppHand();
          cardCount --
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



