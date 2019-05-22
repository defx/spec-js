const parse = require("./parse");
const parseConditions = require("./parseConditions");
const build = require("./build");

module.exports = str => {
  const items = str
    .trim()
    .toLowerCase()
    .split(/\n{2,}/)
    .map(str => ({
      node: parse(str),
      value: str
    }))
    .map(parseConditions);
  return build(items);
};
