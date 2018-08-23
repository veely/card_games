
exports.up = function(knex, Promise) {
  return knex.schema.createTable('players', function(table){
    table.string('username');
    table.integer('session_id');
    table.boolean('player_is_host');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('players');
};
