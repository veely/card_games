exports.up = function(knex, Promise) {
  return knex.schema.createTable('game_ranks', function (table) {
    table.string('game_name');
    table.integer('rank_2_value');
    table.integer('rank_3_value');
    table.integer('rank_4_value');
    table.integer('rank_5_value');
    table.integer('rank_6_value');
    table.integer('rank_7_value');
    table.integer('rank_8_value');
    table.integer('rank_9_value');
    table.integer('rank_10_value');
    table.integer('rank_J_value');
    table.integer('rank_Q_value');
    table.integer('rank_K_value');
    table.integer('rank_A_value');
    table.integer('joker_value');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('game_ranks');
};
