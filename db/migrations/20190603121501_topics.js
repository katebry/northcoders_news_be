exports.up = function(knex, Promise) {
    console.log("creating the topics table...");
    return knex.schema.createTable("topics", (topicsTable) => {
        topicsTable.string("slug").primary().unique();
        topicsTable.text("description").notNullable();
    });
};

exports.down = function(knex, Promise) {
  console.log("removing the topics table...");
  return knex.schema.dropTable("topics");
};
