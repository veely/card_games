$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });;
});


const GS = io('/goofspiel');


// game session ID is accessed through a cookie
// connecting socket to the goofspiel namespace
GS.on('connection', function(socket) {
  socket.join('put in game session ID')
  GS.to('put in game session ID').emit('game information on hands')
})



// header

$(document).ready(function() {
  $("#loginSubmit").click(function () {
    //fix
    $.post("/login", "data that you want to send", function() {
    })
  })

  $("#registerSubmit").click(function() {
    let $registerInfo = {
      name: $("#fullNameReg"),
      birthdate: $("birthDateReg"),
      email: $("emailReg"),
      username: $("usernameReg"),
      password: $("passwordReg")
    }
    $.post("/register", $registerInfo, function() {
    })
  })

  // $("logout").click(function() {
  //   $.post("/logout");
  // })

})
