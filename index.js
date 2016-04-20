'use strict'

var util = require('util')
var EventEmitter = require('events').EventEmitter
var concat = require('concat-stream')
var reverseHttp = require('reverse-http')
var request = require('request')
var plist = require('plist')
var bplist = {
  encode: require('bplist-creator'),
  decode: require('bplist-parser').parseBuffer
}

var noop = function () {}

module.exports = AirPlay

util.inherits(AirPlay, EventEmitter)

function AirPlay (host, port) {
  if (!(this instanceof AirPlay)) return new AirPlay(host, port)
  if (!port) port = 7000

  EventEmitter.call(this)

  this.host = host
  this.port = port

  // TODO: It might be smart to wait starting this until we play and then close
  // it when we're done playing
  this._startReverse()
}

AirPlay.prototype._startReverse = function () {
  var self = this

  this._rserver = reverseHttp({ hostname: this.host, port: this.port, path: '/reverse' }, function (req, res) {
    if (req.method !== 'POST' || req.url !== '/event') {
      // TODO: Maybe we should just accept it silently?
      res.statusCode = 404
      res.end()
      return
    }

    req.pipe(concat(function (data) {
      res.end()

      switch (req.headers['content-type']) {
        case 'text/x-apple-plist+xml':
        case 'application/x-apple-plist':
          data = plist.parse(data.toString())
          break
      }

      self.emit('state', data)
    }))
  })
}

AirPlay.prototype.close = function (cb) {
  this._rserver.close(cb)
}

AirPlay.prototype.serverInfo = function serverInfo (cb) {
  this._request('GET', '/server-info', cb)
}

AirPlay.prototype.play = function play (url, position, cb) {
  if (typeof position === 'function') return this.play(url, 0, position)

  var body = 'Content-Location: ' + url + '\n' +
             'Start-Position: ' + position + '\n'

  this._request('POST', '/play', body, cb || noop)
}

AirPlay.prototype.scrub = function scrub (position, cb) {
  if (typeof position === 'function') return this.scrub(null, position)

  var method, path
  if (position === null) {
    method = 'GET'
    path = '/scrub'
  } else {
    method = 'POST'
    path = '/scrub?position=' + position
  }

  this._request(method, path, cb || noop)
}

AirPlay.prototype.rate = function rate (speed, cb) {
  this._request('POST', '/rate?value=' + speed, cb || noop)
}

AirPlay.prototype.pause = function pause (cb) {
  this.rate(0, cb)
}

AirPlay.prototype.resume = function pause (cb) {
  this.rate(1, cb)
}

AirPlay.prototype.stop = function stop (cb) {
  this._request('POST', '/stop', cb || noop)
}

AirPlay.prototype.playbackInfo = function playbackInfo (cb) {
  this._request('GET', '/playback-info', cb)
}

AirPlay.prototype.property = function property (name, value, cb) {
  if (typeof value === 'function') return this.property(name, null, value)

  var method, path
  if (value === null) {
    method = 'POST'
    path = '/getProperty?' + name
  } else {
    method = 'PUT'
    path = '/setProperty?' + name
  }

  this._request(method, path, value, cb)
}

AirPlay.prototype._request = function _request (method, path, body, cb) {
  if (typeof body === 'function') return this._request(method, path, null, body)

  var opts = this._reqOpts(method, path, body)

  request(opts, function (err, res, body) {
    if (err) return cb(err, res, body)
    if (res.statusCode !== 200) err = new Error('Unexpected response from Apple TV: ' + res.statusCode)

    switch (res.headers['content-type']) {
      case 'application/x-apple-binary-plist':
        body = bplist.decode(body)[0]
        break
      case 'text/x-apple-plist+xml':
        body = plist.parse(body.toString())
        break
      case 'text/parameters':
        body = body.toString().trim().split('\n').reduce(function (body, line) {
          line = line.split(': ')
          // TODO: For now it's only floats, but it might be better to not expect that
          body[line[0]] = parseFloat(line[1], 10)
          return body
        }, {})
        break
    }

    cb(err, res, body)
  })
}

AirPlay.prototype._reqOpts = function _reqOpts (method, path, body) {
  var opts = {
    method: method,
    url: 'http://' + this.host + ':' + this.port + path,
    headers: {
      'User-Agent': 'iTunes/11.0.2'
    },
    encoding: null, // In case a binary plist is returned we don't want to convert it to a string
    forever: true // The Apple TV will refuse to play if the play socket is closed
  }

  if (body && typeof body === 'object') {
    opts.headers['Content-Type'] = 'application/x-apple-binary-plist'
    opts.body = bplist.encode(body)
  } else if (typeof body === 'string') {
    opts.headers['Content-Type'] = 'text/parameters'
    opts.body = body
  }

  return opts
}
