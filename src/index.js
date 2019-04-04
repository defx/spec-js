const chain = require("./chain");
const parse = require("./parse");
const parseConditions = require("./parseConditions");
const validate = require("./validate");
const build = require("./build");

module.exports = str =>
  chain(str)
    .then(str =>
      str
        .trim()
        .toLowerCase()
        .split(/\n{2,}/)
    )
    .map(str => ({
      node: parse(str),
      value: str
    }))
    .map(parseConditions)
    .then(validate)
    .then(build);
