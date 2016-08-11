var bunyan = require('bunyan')
var bunyanLogger = require('express-bunyan-logger')
var uuid = require('node-uuid')
var LogentriesLogger = require('le_node')
var LogentriesDefaults = require('le_node/lib/node_modules/defaults')
var util = require('util')
var stream = require('stream')

var streams = [{
  level: 'debug',
  stream: process.stdout,
}]

function BunyanStream(opt) {
  opt = opt || {}

  stream.Writable.call(this, {
    objectMode: true,
    highWaterMark: opt.bufferSize || LogentriesDefaults.bufferSize,
  })

  this.logger = new LogentriesLogger(opt)
  this.logger.on('error', function(err) {
    console.error('logentries error:', err) // eslint-disable-line no-console
  })
}
util.inherits(BunyanStream, stream.Writable)

BunyanStream.prototype._write = function(log, enc, cb) {
  delete log.v
  this.logger.log(log)
  setImmediate(cb)
}

var bunyanStream

if (process.env.LOG_LE_TOKEN && process.env.LOG_LE_TOKEN !== '**ChangeMe**') {
  bunyanStream = new BunyanStream({
    token: process.env.LOG_LE_TOKEN,
    withLevel: false,
    secure: true,
  })

  streams.push({
    level: 'info',
    stream: bunyanStream,
    type: 'raw',
  })
}

var log = bunyan.createLogger({
  name: 'app',
  level: 'debug',
  streams: streams,
  serializers: {
    err: bunyan.stdSerializers.err,
  },
})
log.bunyanStream = bunyanStream

var eventLog = bunyan.createLogger({
  name: 'event',
  level: 'debug',
  streams: streams,
  serializers: {
    err: bunyan.stdSerializers.err,
  },
})
log.event = function(name, data) {
  eventLog.info(data, name)
}

function defaultGenerateRequestId(req) {
  if (!req.id) {
    req.id = uuid.v4()
  }
  return req.id
}

/**
 * Returns a request logger middleware.
 */
log.requestLogger = function() {
  return bunyanLogger({
    name: 'request',
    parseUA: false,
    format: ':remote-address :method :url :status-code :response-time ms',
    excludes: ['body', 'short-body', 'http-version', 'response-hrtime', 'req-headers', 'res-headers', 'req', 'res', 'referer', 'incoming', 'user-agent'],
    streams: streams,
    genReqId: defaultGenerateRequestId,
  })
}

/**
 * Returns an error logger middleware.
 */
log.errorLogger = function() {
  return bunyanLogger.errorLogger({
    name: 'error',
    parseUA: true,
    format: ':remote-address :method :url :status-code :response-time ms :err[message]',
    excludes: ['short-body', 'incoming', 'response-hrtime'],
    streams: streams,
    immediate: true,
    genReqId: defaultGenerateRequestId,
  })
}

module.exports = log
