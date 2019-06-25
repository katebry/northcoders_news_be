const connection = require("../db/connection");

exports.fetchArticlesById = article_id => {
  return connection("articles")
    .select("articles.*")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .where({ "articles.article_id": article_id })
    .then(([article]) => article);
};

exports.patchArticle = (article_id, updatedVoteCount = 0) => {
  return connection("articles")
    .where({ "articles.article_id": article_id })
    .increment("votes", updatedVoteCount)
    .returning("*")
    .then(([article]) => article);
};

exports.postCommentToArticle = (article_id, newComment) => {
  return connection("comments")
    .insert({ ...newComment, article_id })
    .returning("*")
    .then(([comment]) => comment);
};

exports.fetchCommentsByArticleId = article_id => {
  return connection("comments")
    .where({ "comments.article_id": article_id })
    .returning("*");
};
