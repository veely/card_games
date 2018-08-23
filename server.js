"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();
const socket      = require('socket.io');

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

//Sockets server connect stuff
var server = app.listen(3000, function() {
   console.log('listening to requests on port 3000');
});
var io = socket(server);

//****************ROOM LOGIC***************************
io.on('connection', function(socket) {
   console.log('made socket connection', socket.id);

   socket.on('chat', function(data) {
    console.log("this is the data", data);
      // io.sockets.emit('chat', data);
   });

   socket.on('typing', function(data) {
      socket.broadcast.emit('typing', data);
   });

});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++




// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/game", (req, res) => {
  res.render("Game");
});


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
