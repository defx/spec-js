# spec-js

A JavaScript function for turning a [spec](https://github.com/defx/spec) formatted string into a state machine.

## Usage

Compilation of your spec happens in two phases. First, your spec file is compiled into a serialisable set of state transitions that can be loaded by your application at runtime. Second, at runtime, you require only the core.js file to compile your transitions into a state machine.

```js
const spec = `
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
```

## License

MIT &copy; Matt Donkin
