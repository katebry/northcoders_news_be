const { articles, comments, topics, users } = require("../data");
const {
  formatTimeStamp,
  changeKey,
  createRef,
  formatCommentsByArticleId
} = require("../../utils/seed-functions");

exports.seed = function(knex, Promise) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex("topics").insert(topics);
    })
    .then(() => {
      return knex("users").insert(users);
    })
    .then(() => {
      return knex("articles")
        .insert(formatTimeStamp(articles))
        .returning("*");
    })
    .then(articlesRows => {
      const articlesRef = createRef(articlesRows);
      const commentsWithArticleId = formatCommentsByArticleId(
        comments,
        articlesRef
      );
      const commentsWithTimeStamp = formatTimeStamp(commentsWithArticleId);
      const formattedComments = changeKey(commentsWithTimeStamp, "created_by");
      return knex("comments").insert(formattedComments);
    });
};
