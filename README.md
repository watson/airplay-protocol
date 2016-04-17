# airplay-protocol

A low level protocol wrapper on top of the AirPlay HTTP API.

[![Build status](https://travis-ci.org/watson/airplay-protocol.svg?branch=master)](https://travis-ci.org/watson/airplay-protocol)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Installation

```
npm install airplay-protocol --save
```

## API

### `new AirPlay(host[, port])`

Initiate a connection to a specific AirPlay server given a host or IP
address and a port. If no port is given, the default port 7000 is used.

Returns an instance of the AirPlay object.

```js
var AirPlay = require('airplay-protocol')

var airplay = new AirPlay('192.168.0.42', 7000)
```

### Event: `state`

```js
function (state) {}
```

Emitted by the AirPlay server every time the state of the playback
changes.

Possible states: `loading`, `playing`, `paused` or `stopped`.

### `airplay.serverInfo(callback)`

Get the AirPlay server info.

Calls the callback with the plist result as the second argument or
optionally an error object as the first argument.

### `airplay.play(url[, position][, callback])`

Start video playback.

Arguments:

- `url` - The URL to play
- `position` - Optional start position. A floating point number between
  `0` and `1` where `0` represents the begining of the video and `1` the
  end. Defaults to `0`
- `callback` - Optional callback. Will be called when the play request
  have been processed by the AirPlay server. An error object may be
  given as the first argument

### `airplay.scrub(callback)`

Retrieve the current playback position.

Arguments:

- `callback` - Will be called with the current playback position as the
  second argument. An error object may be given as the first argument

### `airplay.scrub(position[, callback])`

Seek to an arbitrary location in the video.

Arguments:

- `position` - A float value representing the location in seconds
- `callback` - Optional callback. Will be called when the scrub request
  have been processed by the AirPlay server. An error object may be
  given as the first argument

### `airplay.rate(speed[, callback])`

Change the playback rate.

Arguments:

- `speed` - A float value representing the playback rate: 0 is paused, 1
  is playing at the normal speed
- `callback` - Optional callback. Will be called when the scrub request
  have been processed by the AirPlay server. An error object may be
  given as the first argument

### `airplay.stop([callback])`

Stop playback.

Arguments:

- `callback` - Optional callback. Will be called when the stop request
  have been processed by the AirPlay server. An error object may be
  given as the first argument

### `airplay.playbackInfo(callback)`

Retrieve playback informations such as position, duration, rate,
buffering status and more.

Arguments:

- `callback` - Will be called with a playback-info object as the second
  argument. An error object may be given as the first argument

### `airplay.property(name, callback)`

Get playback property.

Arguments:

- `name` - The name of the property to get
- `callback` - Will be called with the property value as the second
  argument. An error object may be given as the first argument

### `airplay.property(name, value[, callback])`

Set playback property.

Arguments:

- `name` - The name of the property to set
- `value` - The plist object to set
- `callback` - Optional callback. Will be called when the set-property
  request have been processed by the AirPlay server. An error object may
  be given as the first argument

## License

MIT
