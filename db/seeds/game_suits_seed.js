
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('game_suits').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('game_suits').insert({game_name: 'goofspiel', diamonds_value: 0, clubs_value: 0, hearts_value: 0, spades_value: 0}),
        knex('game_suits').insert({game_name: 'big_two', diamonds_value: 1, clubs_value: 2, hearts_value: 3, spades_value: 4})
      ]);
    });
};
