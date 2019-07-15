const express = require("express");
const app = express();
var cors = require("cors");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
  resourceNotFound
} = require("./errors");

const apiRouter = require("./routes/apiRouter");

app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);
app.all("/*", resourceNotFound);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
