"use strict";


function createTableHTML () {
  let tableHTML = `<table>\n<tr>\n<th>Session</th>\n<th>Opponent</th>\n<th></th>\n</tr>`;
  console.log(username);
  return username
}

function renderTableHTML () {
  $('.sessionTable').append(createTableHTML)
}

renderTableHTML();


      // <section class="sessionTable">
      //   <table>
      //     <tr>
            <th>Session</th>
            <th>Opponent</th>
            <th></th>
          </tr>
      //     <tr>
      //       <td>1</td>
      //       <td>Germany</td>
      //       <td>
      //         <button>Join Game</button>
      //       </td>
      //     </tr>
      //     <tr>
      //       <td>2</td>
      //       <td>Mexico</td>
      //       <td>
      //         <button>Join Game</button>
      //       </td>
      //     </tr>
      //   </table>
      // </section>
