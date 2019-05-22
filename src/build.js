const { compute } = require("./core");

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

  const initial = compute(
    initialValues.reduce(
      (a, [{ value: k }, { value: v }]) => ({
        ...a,
        [k]: v
      }),
      {}
    ),
    computed
  );

  const events = eventDriven.reduce(
    (a, { preconditions, postconditions, event }) => {
      const parts = {};

      if (preconditions.length) parts.preconditions = preconditions;

      parts.postconditions = postconditions;

      return {
        ...a,
        [event]: parts
      };
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
