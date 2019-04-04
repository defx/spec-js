/*

there can be a race condition if both of the following hold true:

  1) the two sets of preconditions do not share any common keys, other than those with common values

  2) the two sets of postconditions share at least one common key with more than one different value 

*/

const chalk = require("chalk");

const highlight = (scenario, [k, v]) => {
  const [start, end] = scenario.split(k);
  const [s2, e2] = end.split(v);
  return `${start}${chalk.bold.yellow(k)}${s2}${chalk.bold.yellow(v)}${e2}`;
};

const potentialRaceCondition = (a, b) => {
  if (
    a.preconditions.find(([kA, vA]) =>
      b.preconditions.find(([kB, vB]) => kA === kB && vA !== vB)
    )
  )
    return false; //can't occur at the same time

  const match = a.postconditions.find(([kA, vA]) =>
    b.postconditions.find(([kB, vB]) => kA === kB && vA !== vB)
  );

  if (match) {
    const [k, v] = match;

    const reverseMatch = b.postconditions.find(
      ([kA, vA]) => kA === k && vA !== v
    );

    console.warn(`
${chalk.yellow("=============================================================")}
Potential race condition between the following two scenarios:

${highlight(a.value, match)}

${highlight(b.value, reverseMatch)}
${chalk.yellow("=============================================================")}
`);

    return true;
  }

  return false;
};

/* currently exits after the first validation error */
const validate = items => {
  const scenarios = items.filter(({ node: { type } }) => type === "Scenario");
  const error = scenarios.find((current, i, scenarios) => {
    if (i === scenarios.length - 1) return;
    const rest = scenarios.slice(i + 1);
    return rest.find(next => potentialRaceCondition(current, next));
  });
  return !error;
};

module.exports = conditions => {
  try {
    validate(conditions);
  } catch (e) {
    console.error(`There was an error whilst trying to validate.`);
  }
  return conditions;
};
