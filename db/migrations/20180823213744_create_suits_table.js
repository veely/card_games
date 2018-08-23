exports.up = function(knex, Promise) {
  return knex.schema.createTable('suits', function (table) {
    table.string('suit_name').primary();
    table.integer('value');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('suits');
};
