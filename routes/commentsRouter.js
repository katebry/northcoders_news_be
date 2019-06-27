const commentsRouter = require("express").Router();
const { sendMethodNotAllowed } = require("../errors/index");
const {
  updateCommentVoteCount,
  deleteCommentById
} = require("../controllers/comments");

commentsRouter
  .route("/:comment_id")
  .patch(updateCommentVoteCount)
  .delete(deleteCommentById)
  .all(sendMethodNotAllowed);

module.exports = commentsRouter;
