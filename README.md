# spec-js-parser

A JavaScript function for parsing [.spec](https://github.com/defx/spec) files.

## Install

`$ npm install spec-js-parser`

## Usage

```js
const parse = require("spec-js-parser");

parse(`
Given that [playback] is [paused]
Then the [pause button] is [hidden]
And the [play button] is [visible]
`);
/*
=>
[
  [
    {
      "name": "given",
      "values": [
        { "type": "component", "value": "playback" },
        { "type": "current state", "value": "paused" }
      ]
    },
    {
      "name": "then",
      "values": [
        { "type": "component", "value": "pause button" },
        { "type": "next state", "value": "hidden" }
      ]
    },
    {
      "name": "and",
      "values": [
        { "type": "component", "value": "play button" },
        { "type": "next state", "value": "visible" }
      ]
    }
  ]
]
*/
```

```js
const parse = require("spec-js-parser");

parse(`
given that [playback] is [paused]
when the [user] [taps] the [play button]
then [playback] is [resumed]
`);
/*
=>
[
  [
    {
      "name": "given",
      "values": [
        { "type": "component", "value": "playback" },
        { "type": "current state", "value": "paused" }
      ]
    },
    {
      "name": "when",
      "values": [
        { "type": "event source", "value": "user" },
        { "type": "event", "value": "taps" },
        { "type": "event target", "value": "play button" }
      ]
    },
    {
      "name": "then",
      "values": [
        { "type": "component", "value": "playback" },
        { "type": "next state", "value": "resumed" }
      ]
    }
  ]
]
*/
```

## License

MIT &copy; Matt Donkin
