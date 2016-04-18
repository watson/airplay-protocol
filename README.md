# airplay-protocol

A low level protocol wrapper on top of the AirPlay HTTP API used to
connect to an Apple TV.

Currently only the video API is implemented.

[![Build status](https://travis-ci.org/watson/airplay-protocol.svg?branch=master)](https://travis-ci.org/watson/airplay-protocol)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Installation

```
npm install airplay-protocol --save
```

## Example Usage

```js
var AirPlay = require('airplay-protocol')

var airplay = new AirPlay('apple-tv.local')

airplay.play('http://example.com/video.m4v', function (err) {
  if (err) throw err

  airplay.playbackInfo(function (err, res, body) {
    if (err) throw err
    console.log('Playback info:', body)
  })
})
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

Arguments:

- `callback` - Will be called when the request have been processed by
  the AirPlay server. The first argument is an optional Error object.
  The second argument is an instance of [`http.IncomingMessage`][1] and
  the third argument is a parsed plist object containing the server info

### `airplay.play(url[, position][, callback])`

Start video playback.

Arguments:

- `url` - The URL to play
- `position` (optional) - A floating point number between `0` and `1`
  where `0` represents the begining of the video and `1` the end.
  Defaults to `0`
- `callback` (optional) - Will be called when the request have been
  processed by the AirPlay server. The first argument is an optional
  Error object. The second argument is an instance of
  [`http.IncomingMessage`][1]

### `airplay.scrub(callback)`

Retrieve the current playback position.

Arguments:

- `callback` - Will be called when the request have been processed by
  the AirPlay server. The first argument is an optional Error object.
  The second argument is an instance of [`http.IncomingMessage`][1] and
  the third argument is the current playback position

### `airplay.scrub(position[, callback])`

Seek to an arbitrary location in the video.

Arguments:

- `position` - A float value representing the location in seconds
- `callback` (optional) - Will be called when the request have been
  processed by the AirPlay server. The first argument is an optional
  Error object. The second argument is an instance of
  [`http.IncomingMessage`][1]

### `airplay.rate(speed[, callback])`

Change the playback rate.

Arguments:

- `speed` - A float value representing the playback rate: 0 is paused, 1
  is playing at the normal speed
- `callback` (optional) - Will be called when the request have been
  processed by the AirPlay server. The first argument is an optional
  Error object. The second argument is an instance of
  [`http.IncomingMessage`][1]

### `airplay.stop([callback])`

Stop playback.

Arguments:

- `callback` (optional) - Will be called when the request have been
  processed by the AirPlay server. The first argument is an optional
  Error object. The second argument is an instance of
  [`http.IncomingMessage`][1]

### `airplay.playbackInfo(callback)`

Retrieve playback informations such as position, duration, rate,
buffering status and more.

Arguments:

- `callback` - Will be called when the request have been processed by
  the AirPlay server. The first argument is an optional Error object.
  The second argument is an instance of [`http.IncomingMessage`][1] and
  the third argument is a parsed plist object containing the playback info

### `airplay.property(name, callback)`

Get playback property.

Arguments:

- `name` - The name of the property to get
- `callback` - Will be called when the request have been processed by
  the AirPlay server. The first argument is an optional Error object.
  The second argument is an instance of [`http.IncomingMessage`][1] and
  the third argument is a parsed plist object containing the property

### `airplay.property(name, value[, callback])`

Set playback property.

Arguments:

- `name` - The name of the property to set
- `value` - The plist object to set
- `callback` (optional) - Will be called when the request have been
  processed by the AirPlay server. The first argument is an optional
  Error object. The second argument is an instance of
  [`http.IncomingMessage`][1]

## License

MIT

[1]: https://nodejs.org/api/http.html#http_class_http_incomingmessage
