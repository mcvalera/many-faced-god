// votes
//   count
//   percentage
//   candidate_id
//   region_id

// regions
//   id  -  customCode
//   name - name
//   type - categoryName
//   parent_region_id - parentRegionCC

// candidates
//   id
//   name
//   contest


exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTable('votes', function(table) {
      table.integer('count');
      table.float('percentage');
      table.string('candidate_id');
      table.string('region_id');
    }),

    knex.schema.createTable('regions', function(table) {
      table.string('id').primary();
      table.string('name');
      table.string('type');
      table.string('parent_region_id');
    }),

    knex.schema.createTable('candidates', function(table) {
      table.string('id').primary();
      table.string('name');
      table.string('contest');
    })

  ])
};

exports.down = function(knex, Promise) {
   return Promise.all([

    knex.schema.dropTable('votes'),

    knex.schema.dropTable('regions'),

    knex.schema.dropTable('candidates')

  ])
};

