import parseConditions from "./parseConditions";

const SCENARIO = "Scenario";
const INITIAL_VALUE = "InitialValue";
const COMPONENT = "Component";
const CURRENT_STATE = "CurrentState";
const NEXT_STATE = "NextState";
const EVENT = "Event";
const EVENT_TARGET = "EventTarget";
const EVENT_SOURCE = "EventSource";

const typeMap = {
  given: {
    2: [COMPONENT, CURRENT_STATE]
  },
  when: {
    2: [EVENT_TARGET, EVENT],
    3: [EVENT_SOURCE, EVENT, EVENT_TARGET]
  },
  then: {
    2: [COMPONENT, NEXT_STATE]
  }
};

const values = (name, tags) => {
  const types = typeMap[name][tags.length];
  return types.map((type, i) => ({
    type,
    value: tags[i]
  }));
};

const first = arr => arr[0];
const last = arr => arr[arr.length - 1];
const firstWord = str => first(str.split(" "));

const stripBrackets = str => {
  const match = str.match(/\[(.+?)\]/);
  return match && match[1];
};

const capitalised = ([first, ...rest]) =>
  `${first.toUpperCase()}${rest.map(c => c.toLowerCase()).join("")}`;

let previous;

const parseLine = str => {
  const realName = firstWord(str);
  const stageName = realName === "and" ? previous : realName;
  const tags = str.match(/\[(.+?)\]/g);

  if (tags.length === 0) {
    console.warn(`
        Scenarios containing statements without square brackets are ignored:
            ${str}
        `);
    return;
  }

  const lengths = Object.keys(typeMap[stageName]).map(v => +v);

  if (!lengths.includes(tags.length)) {
    const rest = lengths[1]
      ? `between ${first(lengths)} and ${last(lengths)} entities`
      : `only one entity`;

    console.warn(`
        "${stageName}..." statements may contain ${rest}
        (${str})
      `);
    return;
  }

  if (["given", "then"].includes(realName)) previous = realName;

  return {
    name: capitalised(realName),
    value: values(stageName, tags.map(stripBrackets))
  };
};

const pattern = /^((given( and)* )(when )?|(when ))then{1}( and)*/;

const splitLines = str => str.split(/\n/);

const parseScenarioDefinition = str => {
  const lines = splitLines(str);
  const firstWords = lines.map(firstWord).join(" ");

  if (!firstWords.match(pattern)) {
    console.warn(
      `Invalid statement order:
            ${str}
        (This statement is being ignored)
        `
    );
    return;
  }

  const value = lines.map(parseLine);

  if (value.find(v => !v)) return null;

  return {
    type: SCENARIO,
    value
  };
};

const parseInitialValueDefinition = str =>
  splitLines(str).map(str => {
    const [left, right] = str.split(" is ");

    if (!left || !right) return;

    return {
      type: INITIAL_VALUE,
      value: [
        {
          type: COMPONENT,
          value: stripBrackets(left)
        },
        {
          type: CURRENT_STATE,
          value: stripBrackets(right)
        }
      ]
    };
  });

const dispatch = (str, i) => {
  if (i === 0 && !str.match(/given |when /))
    return parseInitialValueDefinition(str);
  return parseScenarioDefinition(str);
};

const parse = str => {
  const tree = str
    .trim()
    .toLowerCase()
    .split(/\n{2,}/)
    .map(dispatch)
    .reduce((a, v) => a.concat(v))
    .filter(v => v);

  const byType = type => tree.filter(entry => entry.type === type);
  const findInTree = type => byType(type).map(({ value }) => value);

  const initialValues = findInTree("InitialValue");
  const scenarios = findInTree("Scenario");
  const conditions = parseConditions(scenarios);

  //@TODO: validate conditions...

  return {
    conditions,
    initialValues,
    scenarios,
    tree
  };
};

module.exports = parse;
