
exports.up = function(knex, Promise) {
    console.log("creating the articles table...");
    return knex.schema.createTable("articles", (articlesTable) => {
        articlesTable.increments("article_id").primary();
        articlesTable.string("title").notNullable(); 
        articlesTable.text("body").notNullable();
        articlesTable.integer("votes").defaultTo(0);
        articlesTable.timestamp("created_at").defaultTo(knex.fn.now());
        articlesTable.string("topic").references("topics.slug");
        articlesTable.string("author").references("users.username")
    });
};

exports.down = function(knex, Promise) {
    console.log("removing the articles table...");
    return knex.schema.dropTable("articles");
};
