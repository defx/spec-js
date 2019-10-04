const parse = require("./parse");
const parseConditions = require("./parseConditions");
const build = require("./build");

/**
 * Compiles a serializable representation of the state transitions described in the spec
 * @param {string} spec Conforming to https://github.com/defx/spec
 */
const compile = spec => {
  const items = spec
    .trim()
    .toLowerCase()
    .split(/\n{2,}/)
    .map(scenario => ({
      node: parse(scenario),
      value: scenario
    }))
    .map(parseConditions);
  return build(items);
};

module.exports = compile;
