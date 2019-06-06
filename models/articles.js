const connection = require("../db/connection");

exports.fetchArticlesById = article_id => {
  return connection("articles")
    .select("articles.*")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .where({ "articles.article_id": article_id });
};
