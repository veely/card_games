"use strict";

function createRankTableHTML (arr) {
  let tableHTML = `
    <tr>
      <th>Name</th>
      <th>Rank</th>
      <th>Wins</th>
    </tr>
  `

  let count = 1
  for (let player of arr) {
    tableHTML += `
        <tr>
          <td>${player.username}</td>
          <td>${count}</td>
          <td>${player.wins}</td>
        </tr>
    `
    count ++
  }
  tableHTML += "</table>"
  return tableHTML
}

function renderTableHTML (arr) {
  $('.rankingTable').append(createRankTableHTML(arr))
}

function sortByRank (a,b) {
  return b.wins - a.wins;
}

function sortRankArray (arr) {
  arr.sort(sortByRank);
}

$(document).ready(function() {
  let templateVars = JSON.parse($(".rankTable").text());
  sortRankArray(templateVars)
  renderTableHTML(templateVars)
  $(".loginToggle").slideToggle(function() {

  })
})

