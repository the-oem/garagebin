exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('items', (table) => {
      table.increments('id').primary();
      table.string('name').unique();
      table.string('staleness_reason');
      table.string('cleanliness');
      table.timestamps(true, true);
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('items')
  ]);
};
