"use strict";

const myHand = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const prizeCards = [{'A': 1}, {'2': 2},{'3': 3}, {'4': 4}, {'5': 5}, {'6': 6}, {'7': 7}, {'8': 8}, {'9': 9}, {'10': 10}, {'J': 11}, {'Q': 12}, {'K': 13}]

// variables for scoreboard
let score1 = 0;
let score2 = 0;

// variable for prize card
let cardValue;

// variable for number of opponent hand cards
let cardCount = 13

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
  <button type="submit" class='card card1' value="1">A</button>
  <button type="submit" class='card card1' value="2">2</button>
  <button type="submit" class='card card1' value="3">3</button>
  <button type="submit" class='card card1' value="4">4</button>
  <button type="submit" class='card card1' value="5">5</button>
  <button type="submit" class='card card1' value="6">6</button>
  <button type="submit" class='card card1' value="7">7</button>
  <button type="submit" class='card card1' value="8">8</button>
  <button type="submit" class='card card1' value="9">9</button>
  <button type="submit" class='card card1' value="10">10</button>
  <button type="submit" class='card card1' value="11">J</button>
  <button type="submit" class='card card1' value="12">Q</button>
  <button type="submit" class='card card1' value="13">K</button>
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

let gamePrize = shuffleCards(prizeCards)

function getNextPrize (arr) {
  if (arr) {
    return arr.pop();
  } else {
    return null
  }
}

function createPrizeCard (arr) {
  if (arr.length !== 0) {
    let nextPrize = getNextPrize(arr);
    let cardText = (Object.keys(nextPrize))[0];
    cardValue = nextPrize[cardText]
    var prizeHTML = `<h1 class="new-prize-hand">${cardText}</h1>`;
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

function updateBoardState () {
  score1 += Number(cardValue)
  cardCount -- ;
  $(".new-prize-hand").remove();
  $(".scoreboard").remove();
  $(".oppHand").remove();
  renderPrizeCards()
  renderScoreBoard();
  renderOppHand();
}

// add conditional for comparing cardvalue to p2 before adding score
// make a database for recording player archive data (who y)
// when score on both sides add up to 91, game ends, player archive data is recorded, player wins is updated

$(document).ready(function() {
  const socket = io.connect('/goofspielNew');
  newBoardState();
  socket.on('newJoin', function (data) {
    $(".card").click(function() {
      let $cardValue = ($(this).val());
      $(this).remove();
      updateBoardState();
      if ($cardValue) {
        socket.emit('latestCard', "player", $cardValue);
        console.log("your card value has been sent")
      }
    })
  });

})


  // var socket = io.connect('http://localhost:8080');
  // socket.on('server', function (data) {
  //   console.log(data);
  //   socket.emit('gameBoard', "gamsession","hi, this is the game message");
  // });





