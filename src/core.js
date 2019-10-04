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

const applyAll = (state, items) =>
  items.reduce(
    (state, { preconditions, postconditions }) =>
      apply(state, preconditions, postconditions),
    state
  );

/**
 * Returns a reducer function to update state based on a named event
 * @param {Object}
 */
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

  return applyAll([entry].concat(computed));
};

module.exports = { applyAll, compute };
