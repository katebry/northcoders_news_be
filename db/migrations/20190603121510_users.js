exports.up = function(knex, Promise) {
    console.log("creating the users table...");
    return knex.schema.createTable("users", (usersTable) => {
        usersTable.increments("username").primary();
        usersTable.string("avatar_url").notNullable();
        usersTable.string("name").notNullable();
    });
};

exports.down = function(knex, Promise) {
    console.log("removing the users table...");
    return knex.schema.dropTable("users");
};
