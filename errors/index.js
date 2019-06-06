exports.handleCustomErrors = (err, req, res, next) => {
  if (404) res.status(404).send({ msg: err.msg });
  else next(err);
  console.log(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  const psqlBadRequestCodes = ["22P02"];
  if (psqlBadRequestCodes.includes(err.code))
    res.status(400).send({ msg: err.message || "Bad Request" });
  else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
