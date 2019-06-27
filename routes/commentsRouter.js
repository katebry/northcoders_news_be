const commentsRouter = require("express").Router();
const { sendMethodNotAllowed } = require("../errors/index");
const { updateCommentVoteCount } = require("../controllers/comments");

commentsRouter
  .route("/:comment_id")
  .patch(updateCommentVoteCount)
  .all(sendMethodNotAllowed);

module.exports = commentsRouter;
