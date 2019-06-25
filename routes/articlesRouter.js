const articlesRouter = require("express").Router();
const {
  sendArticles,
  updateArticle,
  newComment
} = require("../controllers/articles");

articlesRouter
  .route("/:article_id")
  .get(sendArticles)
  .patch(updateArticle);

articlesRouter.route("/:article_id/comments").post(newComment);

module.exports = articlesRouter;
