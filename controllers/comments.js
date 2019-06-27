const { patchVoteCount, deleteComment } = require("../models/comments");

exports.updateCommentVoteCount = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  patchVoteCount(comment_id, inc_votes)
    .then(comment => {
      if (!comment)
        return Promise.reject({
          status: 404,
          msg: `Invalid comment_id: ${comment_id}`
        });
      res.status(200).send({ comment });
    })
    .catch(err => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then(deleteCount => {
      if (!deleteCount) {
        return Promise.reject({
          status: 404,
          msg: `Comment with id ${comment_id} not found`
        });
      }
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
};
