exports.up = function(knex, Promise) {
  return knex.schema.createTable('game_sessions', function (table) {
    table.increments('session_id');
    table.string('game_name');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('game_sessions');
};
