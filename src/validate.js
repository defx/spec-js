/*

there can be a race condition if both of the following hold true:

  1) the two sets of preconditions do not share any common keys, other than those with common values

  2) the two sets of postconditions share at least one common key with more than one different value 

*/

const potentialRaceCondition = (a, b) => {
  const [preA, postA] = a;
  const [preB, postB] = b;

  if (preA.find(([kA, vA]) => preB.find(([kB, vB]) => kA === kB && vA !== vB)))
    return false; //can't occur at the same time

  const raceCondition = postA.find(([kA, vA]) =>
    postB.find(([kB, vB]) => kA === kB && vA !== vB)
  );

  if (raceCondition) {
    /*
    @TODO: print the two scenarios, highlighting the relevant post-condition
    */

    const [, , , scenarioA] = a;
    const [, , , scenarioB] = b;

    console.warn(`

    `);

    return true;
  }

  return false;
};

/* exits after the first validation error */
const validate = conditions => {
  const error = conditions.find((condition, i, all) => {
    if (i === all.length - 1) return;

    const rest = all.slice(i + 1);

    return rest.find(next => potentialRaceCondition(condition, next));
  });
  return !error;
};

module.exports = conditions => {
  validate(conditions);
  return conditions;
};
