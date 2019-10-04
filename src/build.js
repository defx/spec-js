const { applyAll } = require("./core");

const build = items => {
  const eventDriven = items.filter(({ event }) => event);

  const initialValues = items
    .filter(({ node: { type } }) => type === "InitialValue")
    .map(({ node: { value } }) => value);

  const computed = items
    .filter(({ event, node: { type } }) => !event && type === "Scenario")
    .map(({ preconditions, postconditions }) => ({
      preconditions,
      postconditions
    }));

  const initial = applyAll(
    initialValues.reduce((a, [{ value: k }, { value: v }]) => {
      a[k] = v;
      return a;
    }, {}),
    computed
  );

  const events = eventDriven.reduce(
    (a, { preconditions, postconditions, event }) => {
      const parts = {};

      if (preconditions.length) parts.preconditions = preconditions;

      parts.postconditions = postconditions;

      a[event] = a[event] || [];

      a[event].push(parts);

      return a;
    },
    {}
  );

  return {
    initial,
    computed,
    events
  };
};

module.exports = build;
