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
    /* @TODO:
    log message outside later when we have access to the original scenario :)
    */
    const [key] = raceCondition;
    console.warn(`
      Potential race condition for "${key}":
    `);
  }

  if (!raceCondition) return false;

  return true;
};

const validate = (conditions, res = []) => {
  if (!conditions.length) return res;

  const [first, ...rest] = conditions;

  const validated = rest.map(v => ({
    ...v,
    valid: !potentialRaceCondition(first, v)
  }));

  const invalid = validated.filter(({ valid }) => !valid);

  if (!invalid.length) return validate(rest, res);

  const remaining = validated.filter(({ valid }) => valid);
  return validate(remaining, res.concat([first, ...invalid]));
};

module.exports = conditions => {
  validate(conditions);
  return conditions;
};
