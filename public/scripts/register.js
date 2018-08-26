const ENV         = process.env.ENV || "development";
const knexConfig  = require("../../knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const knexLogger  = require('knex-logger');

function register(username, password) {
  return new Promise((resolve, reject) => {
    if (username && password) {
      knex('users').insert({'username': username, 'password': password})
      .asCallback(function(err, rows) {
        resolve("Successfully created new account!");
      });
    } else {
      reject("You must enter all required information!");
    }
  });
}

module.exports = {
  register: register
}
