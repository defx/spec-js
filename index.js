const COMPONENT = "component";
const CURRENT_STATE = "current state";
const NEXT_STATE = "next state";
const EVENT = "event";
const EVENT_TARGET = "event target";
const EVENT_SOURCE = "event source";

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
    name: realName,
    values: values(stageName, tags.map(tag => tag.substr(1, tag.length - 2)))
  };
};

const pattern = /^((given( and)* )(when )?|(when ))then{1}( and)*/;

const parseScenario = str => {
  const lines = str.split(/\n/);
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

  return lines.map(parseLine);
};

const parse = str =>
  str
    .trim()
    .toLowerCase()
    .split(/\n{2,}/)
    .map(parseScenario)
    .filter(v => v && !v.find(v => v === undefined));

module.exports = parse;
