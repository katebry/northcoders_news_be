const topicsRouter = require("express").Router();
const { sendMethodNotAllowed } = require("../errors/index");
const { sendTopics } = require("../controllers/topics");

topicsRouter
  .route("/")
  .get(sendTopics)
  .all(sendMethodNotAllowed);

module.exports = topicsRouter;
