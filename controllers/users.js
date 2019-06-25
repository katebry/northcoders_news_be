const { fetchUsersByUsername } = require("../models/users");

exports.sendUsers = (req, res, next) => {
  const { username } = req.params;
  fetchUsersByUsername(username)
    .then(user => {
      if (!user) {
        return Promise.reject({
          status: 404,
          msg: `Invalid username: ${username}`
        });
      } else {
        res.status(200).send({ user });
      }
    })
    .catch(err => {
      next(err);
    });
};
