const ENV = process.env.NODE_ENV || "test";

const devData = require("./dev-data");
const testData = require("./test-data");

const data = {
  development: devData,
  test: testData
};

module.exports = data[ENV];