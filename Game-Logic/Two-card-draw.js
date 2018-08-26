const cardsValues = {
  '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8, '10': 9, 'J': 10, 'Q': 11, 'K': 12, 'A':13
};

const players = [
{
player: "player_1",
username: "andrew",
hand: ['A', 'A'],
is_host: true
},
{
player: "player_2",
username: "vincent",
hand: ['K', 'K'],
is_host: false
}
];

function totalScore(cards) {
  let totalScore = 0;
  for (let card of cards){
     totalScore += cardsValues[card];
  }
  return totalScore;
};


function winner(players) {
  if(totalScore(players[0].hand) > totalScore(players[1].hand)) {
     console.log(players[0].username + " is the winner!");
  } else if (totalScore(players[0].hand) < totalScore(players[1].hand)) {
     console.log(players[1].username + " is the winner!");
  } else {
     console.log("same score..... play one more time!")
  }
}