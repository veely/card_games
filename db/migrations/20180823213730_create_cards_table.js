exports.up = function(knex, Promise) {
  return knex.schema.createTable('cards', function (table) {
    table.string('rank');
    table.string('suit');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('cards');
};
