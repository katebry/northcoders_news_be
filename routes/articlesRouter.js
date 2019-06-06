const articlesRouter = require("express").Router();
const { sendArticles } = require("../controllers/articles");

articlesRouter.route("/:article_id").get(sendArticles);

module.exports = articlesRouter;
