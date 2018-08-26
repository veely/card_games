"use strict";

function createTableHTML (arr) {
  let tableHTML = `
      <table>
        <tr>
          <th>Session ID</th>
          <th>Opponent Name</th>
          <th>P1 is Host</th>
          <th></th>
        </tr>`
  for (let match of arr) {
    tableHTML += `
        <tr>
          <td>${match.session_id}</td>
          <td>${match.username}</td>
          <td>${!match.player_is_host}</td>
          <td>
            <button>Join Game</button>
          </td>
        </tr>
    `
  }
  tableHTML += "</table>"
  return tableHTML
}

function renderTableHTML (arr) {
  $('.sessionTable').append(createTableHTML(arr))
}




$(document).ready(function() {
  const socket = io.connect("/sessionListGoofspiel")
  socket.on('sessionData', function(data) {
    console.log("data is here")
    renderTableHTML(data);
  })
})
