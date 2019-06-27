exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status === 404) res.status(404).send({ msg: err.msg });
  else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  const psqlBadRequestCodes = ["22P02", "42703", "23503"];
  if (psqlBadRequestCodes.includes(err.code))
    res.status(400).send({ msg: err.message.split(" - ")[1] } || "Bad Request");
  else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};

exports.sendMethodNotAllowed = (req, res) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};

exports.resourceNotFound = (req, res) => {
  res.status(404).send({ msg: "Resource Not Found" });
};
