const { patchVoteCount } = require("../models/comments");

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
