// votes
//   count
//   percentage
//   candidate_id
//   region_id

// regions
//   id
//   name
//   type
//   parent_id

// candidates
//   id
//   name


exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTable('votes', function(table) {
      table.increments();
      table.integer('count');
      table.float('percentage');
      table.integer('candidate_id');
      table.integer('region_id');
      table.timestamps();
    }),

    knex.schema.createTable('regions', function(table) {
      table.increments();
      table.string('name');
      table.string('type');
      table.integer('parent_region_id');
      table.timestamps();
    }),

    knex.schema.createTable('candidates', function(table) {
      table.increments();
      table.string('name');
      table.timestamps();
    })

  ])
};

exports.down = function(knex, Promise) {
  
};
