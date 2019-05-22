const apply = (state, preconditions, postconditions) => {
  if (!preconditions.every(([k, v]) => state[k] === v)) return state;
  return postconditions.reduce(
    (a, [k, v]) => ({
      ...a,
      [k]: v
    }),
    state
  );
};

const compute = (state, computedProperties) =>
  computedProperties.reduce(
    (state, { preconditions, postconditions }) =>
      apply(state, preconditions, postconditions),
    state
  );

module.exports = { compute };
