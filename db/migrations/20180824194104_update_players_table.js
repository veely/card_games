exports.up = function(knex, Promise) {
  return knex.schema.table('players', function (table) {
    table.string('hand');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('players');
};
