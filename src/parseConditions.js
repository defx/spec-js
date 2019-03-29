const value = ({ value }) => value;

const slicePoints = scenario => {
  const when = scenario.findIndex(({ name }) => name === "When");

  if (when > -1) return [when, when + 1];

  const then = scenario.findIndex(({ name }) => name === "Then");

  if (then > -1) return [then, then];
};

const parseConditions = scenarios =>
  scenarios
    .map(scenario => {
      const points = slicePoints(scenario);

      if (!points) return;

      const [end, start] = points;

      const preconditions = scenario
        .slice(0, end)
        .map(value)
        .map(v => v.map(value));

      const postconditions = scenario
        .slice(start)
        .map(value)
        .map(v => v.map(value));

      return [
        preconditions,
        postconditions,
        scenario.find(({ name }) => name === "When")
      ];
    })
    .filter(v => v);

export default parseConditions;
