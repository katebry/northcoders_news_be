const apiData = require("../endpoints.json");

exports.sendJson = (req, res, next) => {
  res.status(200).send(apiData);
};
