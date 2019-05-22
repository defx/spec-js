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

const compute = ({ initial, computed, events }) => (
  state = initial,
  eventName
) => {
  if (!eventName) return state;

  const entry = events[eventName];

  if (!entry) {
    console.warn(`Unknown event name: ${eventName}`);
    return state;
  }

  return [entry]
    .concat(computed)
    .reduce(
      (state, { preconditions, postconditions }) =>
        apply(state, preconditions, postconditions),
      state
    );
};

module.exports = { compute };
