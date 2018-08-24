exports.up = function(knex, Promise) {
  return knex.schema.createTable('game_suits', function (table) {
    table.string('game_name');
    table.integer('diamonds_value');
    table.integer('clubs_value');
    table.integer('hearts_value');
    table.integer('spades_value');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('game_suits');
};
