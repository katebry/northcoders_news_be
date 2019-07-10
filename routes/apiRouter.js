const apiRouter = require("express").Router();
const { sendMethodNotAllowed } = require("../errors/index");
const topicsRouter = require("./topicsRouter");
const usersRouter = require("./usersRouter");
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");
const { sendJson } = require("../controllers/sendJson");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter
  .route("/")
  .get(sendJson)
  .all(sendMethodNotAllowed);

module.exports = apiRouter;
