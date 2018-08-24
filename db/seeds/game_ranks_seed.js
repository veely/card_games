
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('game_ranks').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('game_ranks').insert(
          {
            game_name: 'goofspiel',
            rank_2_value: 2,
            rank_3_value: 3,
            rank_4_value: 4,
            rank_5_value: 5,
            rank_6_value: 6,
            rank_7_value: 7,
            rank_8_value: 8,
            rank_9_value: 9,
            rank_10_value: 10,
            rank_J_value: 11,
            rank_Q_value: 12,
            rank_K_value: 13,
            rank_A_value: 1
          }),
      ]);
    });
};
