const connection = require("../db/connection");

exports.fetchUsersByUsername = username => {
  return connection("users")
    .select("users.*")
    .where({ username });
};
