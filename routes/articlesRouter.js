const articlesRouter = require("express").Router();
const { sendMethodNotAllowed } = require("../errors/index");
const {
  sendArticles,
  updateArticle,
  newComment,
  sendComments
} = require("../controllers/articles");

articlesRouter
  .route("/:article_id")
  .get(sendArticles)
  .patch(updateArticle)
  .all(sendMethodNotAllowed);

articlesRouter
  .route("/:article_id/comments")
  .post(newComment)
  .get(sendComments)
  .all(sendMethodNotAllowed);

module.exports = articlesRouter;
