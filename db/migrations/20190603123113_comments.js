
exports.up = function(knex, Promise) {
    console.log("creating the comments table...");
    return knex.schema.createTable("comments", (commentsTable) => {
        commentsTable.increments("comment_id").primary();
        commentsTable.string("username").references("users.username"); 
        commentsTable.integer("article_id").references("articles.article_id");
        commentsTable.integer("votes").defaultTo(0);
        commentsTable.timestamp("created at").defaultTo(knex.fn.now());
        commentsTable.text("body").notNullable();
    });
};

exports.down = function(knex, Promise) {
    console.log("removing the comments table...");
    return knex.schema.dropTable("comments");
};
