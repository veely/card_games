"use strict";

function createTableHTML (arr) {
  let tableHTML = `
      <table>
        <tr>
          <th class="sessionTableCell">Session ID</th>
          <th class="sessionTableCell">Opponent Name</th>
          <th class="sessionTableCell">P1 is Host</th>
          <th class="sessionTableCell"></th>
        </tr>`
  for (let match of arr) {
    tableHTML += `
        <tr class="sessionTableRow">
          <td class="sessionTableCell">${match.session_id}</td>
          <td class="sessionTableCell">${match.username}</td>
          <td class="sessionTableCell">${!match.player_is_host}</td>
          <td class="sessionTableCell">
            <form method="GET" action="/games/goofspiel/${match.session_id}">
              <button type="submit value="${match.session_id}">Join Game</button>
            </form>
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
