const usersRouter = require("express").Router();
const { sendMethodNotAllowed } = require("../errors/index");
const { sendUsers } = require("../controllers/users");

usersRouter
  .route("/:username")
  .get(sendUsers)
  .all(sendMethodNotAllowed);

module.exports = usersRouter;
