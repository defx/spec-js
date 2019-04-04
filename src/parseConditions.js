const value = ({ value }) => value;

const slicePoints = node => {
  const when = node.findIndex(({ name }) => name === "When");

  if (when > -1) return [when, when + 1];

  const then = node.findIndex(({ name }) => name === "Then");

  if (then > -1) return [then, then];
};

const eventName = event => event.value.map(value).join(" ");

const parseConditions = o => {
  if (o.node.type !== "Scenario") return o;

  const scenario = o.node.value;

  const points = slicePoints(scenario);

  // if (!points) return;

  const [end, start] = points;

  const preconditions = scenario
    .slice(0, end)
    .map(value)
    .map(v => v.map(value));

  const postconditions = scenario
    .slice(start)
    .map(value)
    .map(v => v.map(value));

  const event = scenario.find(({ name }) => name === "When");

  const r = {
    ...o,
    preconditions,
    postconditions
  };

  if (event) r.event = eventName(event);

  return r;
};

module.exports = parseConditions;
