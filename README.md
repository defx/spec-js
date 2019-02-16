# spec-js-parser

A JavaScript function for parsing [.spec](https://github.com/defx/spec) files.

## Install

`$ npm install spec-js-parser`

## Usage

```js
const parse = require("spec-js-parser");

parse(`
[playback] is [paused]

given that [playback] is [paused]
then the [pause button] is [hidden]
and the [play button] is [visible]

given that [playback] is [resumed]
then the [play button] is [hidden]
and the [pause button] is [visible]

given that [playback] is [paused]
when the [user] [taps] the [play button]
then [playback] is [resumed]

given that [playback] is [resumed]
when the [user] [taps] the [pause button]
then [playback] is [paused]
`);
/*
=>
[
  {
    "type": "InitialValue",
    "value": [
      { "type": "Component", "value": "playback" },
      { "type": "CurrentState", "value": "paused" }
    ]
  },
  {
    "type": "Scenario",
    "value": [
      {
        "name": "Given",
        "value": [
          { "type": "Component", "value": "playback" },
          { "type": "CurrentState", "value": "paused" }
        ]
      },
      {
        "name": "Then",
        "value": [
          { "type": "Component", "value": "pause button" },
          { "type": "NextState", "value": "hidden" }
        ]
      },
      {
        "name": "And",
        "value": [
          { "type": "Component", "value": "play button" },
          { "type": "NextState", "value": "visible" }
        ]
      }
    ]
  },
  {
    "type": "Scenario",
    "value": [
      {
        "name": "Given",
        "value": [
          { "type": "Component", "value": "playback" },
          { "type": "CurrentState", "value": "resumed" }
        ]
      },
      {
        "name": "Then",
        "value": [
          { "type": "Component", "value": "play button" },
          { "type": "NextState", "value": "hidden" }
        ]
      },
      {
        "name": "And",
        "value": [
          { "type": "Component", "value": "pause button" },
          { "type": "NextState", "value": "visible" }
        ]
      }
    ]
  },
  {
    "type": "Scenario",
    "value": [
      {
        "name": "Given",
        "value": [
          { "type": "Component", "value": "playback" },
          { "type": "CurrentState", "value": "paused" }
        ]
      },
      {
        "name": "When",
        "value": [
          { "type": "EventSource", "value": "user" },
          { "type": "Event", "value": "taps" },
          { "type": "EventTarget", "value": "play button" }
        ]
      },
      {
        "name": "Then",
        "value": [
          { "type": "Component", "value": "playback" },
          { "type": "NextState", "value": "resumed" }
        ]
      }
    ]
  },
  {
    "type": "Scenario",
    "value": [
      {
        "name": "Given",
        "value": [
          { "type": "Component", "value": "playback" },
          { "type": "CurrentState", "value": "resumed" }
        ]
      },
      {
        "name": "When",
        "value": [
          { "type": "EventSource", "value": "user" },
          { "type": "Event", "value": "taps" },
          { "type": "EventTarget", "value": "pause button" }
        ]
      },
      {
        "name": "Then",
        "value": [
          { "type": "Component", "value": "playback" },
          { "type": "NextState", "value": "paused" }
        ]
      }
    ]
  }
]
*/
```

## License

MIT &copy; Matt Donkin
