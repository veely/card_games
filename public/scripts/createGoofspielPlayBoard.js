"use strict";

const myHand = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const prizeCards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']


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
  let oppHandCode = `
    <button>Card</button>
    <button>Card</button>
    <button>Card</button>
    <button>Card</button>
    <button>Card</button>
    <button>Card</button>
    <button>Card</button>
    <button>Card</button>
    <button>Card</button>
    <button>Card</button>
    <button>Card</button>
    <button>Card</button>
    <button>Card</button>
  `;
  return oppHandCode;
}

function createMyHand () {
  let myHandCode = `
  <button class='A' value='1'>A</button>
  <button class='2' value='2'>2</button>
  <button class='3' value='3'>3</button>
  <button class='4' value='4'>4</button>
  <button class='5' value='5'>5</button>
  <button class='6' value='6'>6</button>
  <button class='7' value='7'>7</button>
  <button class='8' value='8'>8</button>
  <button class='9' value='9'>9</button>
  <button class='10' value='10'>10</button>
  <button class='J' value='11'>J</button>
  <button class='Q' value='12'>Q</button>
  <button class='K' value='13'>K</button>
  `;
  return myHandCode
}

// functions for making prize cards

let gamePrize = shuffleCards(prizeCards)

function createPrizeCard (arr) {
  console.log(arr.pop(), arr.pop(), arr.pop(),arr.pop(), arr.pop(), arr.pop(), arr.pop(), arr.pop(), arr.pop(), arr.pop(), arr.pop(), arr.pop())
  var prizeHTML = "<h1>" + arr.pop() + "</h1>";
  return prizeHTML;
}

function renderHands() {
  let $oppHand = createOpponentHand();
  let $myHand = createMyHand();
  let $prizeCard = createPrizeCard(gamePrize)
  $('.opponent-hand').append($oppHand);
  $('.my-hand').append($myHand);
  $('.prize-hand').append($prizeCard);
}

$(document).ready(function() {
  renderHands()
})


