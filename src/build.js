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

const build = items => {
  const derivatives = items.filter(
    ({ event, node: { type } }) => !event && type === "Scenario"
  );
  const eventDriven = items.filter(({ event }) => event);
  const eventNames = eventDriven.map(({ event }) => event);
  const initialValues = items
    .filter(({ node: { type } }) => type === "InitialValue")
    .map(({ node: { value } }) => value);

  const computeDerivatives = state =>
    derivatives.reduce(
      (state, { preconditions, postconditions }) =>
        apply(state, preconditions, postconditions),
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

  const eventMap = eventDriven.reduce(
    (a, { preconditions, postconditions, event }) => {
      return {
        ...a,
        [event]: state =>
          computeDerivatives(apply(state, preconditions, postconditions))
      };
    },
    {}
  );

  const compute = (state = initialState, eventName) => {
    if (!eventName) return state;

    const fn = eventMap[eventName];

    if (!fn) {
      console.warn(`Unknown event name: ${eventName}`);
      return state;
    }

    return fn(state);
  };

  return {
    eventNames,
    compute
  };
};

module.exports = build;
