const ENV         = process.env.ENV || "development";
const knexConfig  = require("../../knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const knexLogger  = require('knex-logger');

function login(username, password) {
  return new Promise((resolve, reject) => {
    knex.select('username', 'wins')
    .from('users')
    .where({ 'username': username, 'password': password })
    .asCallback(function(err, rows) {
      if(rows[0]) {
        resolve(rows[0]);
      } else {
        reject("Incorrect login information!");
      }
    });
  });
}

module.exports = {
  login: login
}
