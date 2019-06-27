const connection = require("../db/connection");

exports.fetchArticleById = article_id => {
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

exports.fetchCommentsByArticleId = (
  article_id,
  { sort_by = "created_at", order = "desc" }
) => {
  return connection("comments")
    .where({ "comments.article_id": article_id })
    .orderBy(sort_by, order);
};

exports.fetchAllArticles = ({
  sort_by = "created_at",
  order = "desc",
  author,
  topic
}) => {
  return connection("articles")
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by, order)
    .modify(queryBuilder => {
      if (topic) {
        queryBuilder.where("articles.topic", topic);
      }
      if (author) {
        queryBuilder.where("articles.author", author);
      }
    })
    .then(articles => articles);
};
