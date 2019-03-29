# spec-js

A JavaScript function for parsing a string conforming to the [spec](https://github.com/defx/spec) format.

## Usage

```js
const parse = require("spec-js-parser");

const { compute, eventNames } = parse(`
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

eventNames;
/*
[ 'user taps play button', 'user taps pause button' ]
*/

const state = compute();
/*
  {
    'playback': 'paused',
    'pause button' : 'hidden',
    'play button' : 'visible'
  }
*/

compute(state, "user taps play button");
/*
  {
    'playback': 'resumed',
    'pause button' : 'visible',
    'play button' : 'hidden'
  }
*/
```

## License

MIT &copy; Matt Donkin
