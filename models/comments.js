const connection = require("../db/connection");

exports.patchVoteCount = (comment_id, updatedVoteCount = 0) => {
  return connection("comments")
    .where({ "comments.comment_id": comment_id })
    .increment("votes", updatedVoteCount)
    .returning("*")
    .then(([comment]) => comment);
};
