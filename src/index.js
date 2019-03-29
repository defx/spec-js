const parse = require("./parse");

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

const build = (initialValues, conditions) => {
  const derivativeConditions = conditions.filter(([, , e]) => !e);

  const computeDerivatives = state =>
    derivativeConditions.reduce(
      (state, conditions) => apply(state, ...conditions),
      state
    );

  const initialState = computeDerivatives(
    initialValues.reduce(
      (a, [{ value: k }, { value: v }]) => ({
        ...a,
        [k]: v
      }),
      {}
    )
  );

  const eventConditions = conditions.filter(([, , eventName]) => eventName);

  const eventMap = eventConditions.reduce(
    (a, [preconditions, postconditions, eventName]) => {
      return {
        ...a,
        [eventName]: state =>
          computeDerivatives(apply(state, preconditions, postconditions))
      };
    },
    {}
  );

  return (state = initialState, eventName) => {
    const fn = eventMap[eventName];
    return fn ? fn(state) : state;
  };
};

module.exports = str => {
  const { intialValues, conditions } = parse(str);
  return build(intialValues, conditions);
};
