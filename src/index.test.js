const { compile } = require("./index");

const scenario = `
[playback] is [paused]

given that [playback] is [paused]
then the [pause button] is [hidden]
and the [play button] is [visible]

given that [playback] is [resumed]
then the [play button] is [hidden]
and the [pause button] is [visible]

when the [user] [taps] the [play button]
then [playback] is [resumed]

when the [user] [taps] the [pause button]
then [playback] is [paused]
`;

describe("parse", () => {
  it("should...", () => {
    const result = compile(scenario);
    console.log(JSON.stringify(result));
    expect(1).toBe(1);
  });
});
