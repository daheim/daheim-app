import './optional_newrelic'
import './bootstrap'

import path from 'path'
import fs from 'fs'
import passport from 'passport'
import http from 'http'
import spdy from 'spdy'
import express from 'express'
import cookieParser from 'cookie-parser'
import Azure from './azure'
import User from './user'
import tokenHandler from './token_handler'
import config from './config'
import bodyParser from 'body-parser'
import log from './log'
import api from './api'
//import {User as ModelUser} from './model'
import actions from './actions'
import io from './realtime'
import reporter from './reporter'

import createDebug from 'debug'
let debug = createDebug('dhm:app')
debug('starting server')

var app = express()
app.use(reporter.requestHandler)

function createServer () {
  if (process.env.USE_HTTPS === '1') {
    const options = {
      cert: fs.readFileSync(process.env.SSL_CERT),
      key: fs.readFileSync(process.env.SSL_KEY)
    }
    return new spdy.Server(options, app)
  } else {
    return new http.Server(app)
  }
}
const server = createServer()


let azure = Azure.createFromEnv()

app.use(log.requestLogger())
app.enable('trust proxy')
app.disable('x-powered-by')
app.use(bodyParser.json({limit: '1mb'}))
app.use(cookieParser())

//let realtime = new Realtime({log, tokenHandler, config})
//realtime.listen(server)

io.listen(server)

app.use(passport.initialize())
app.use('/api/actions', actions)
app.use('/api', api.router)

app.get('/js/config.js', function(req, res) {
  var cfg = {
    socketIoUrl: 'http://localhost:3000',
    storageAccount: azure.blobs.storageAccount,
  }
  res.send('angular.module("dhm").constant("config", ' + JSON.stringify(cfg) + ')')
})

app.use(express.static(__dirname + '/../../../../build/public'))
app.use(express.static(__dirname + '/../../../../public'))
app.get('*', function(req, res, next) {
  req.url = '/'
  res.sendFile(path.resolve(__dirname + '/../../../../build/public/index.html'))
})

app.use(function(err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }

  if (err.rest) {
    res.status(400).send(err.rest)
  }

  next(err)
})

app.use(reporter.errorHandler)

// log errors
app.use(log.errorLogger())

// error handler
app.use(function(err, req, res, next) {
  // don't do anything if the response was already sent
  if (res.headersSent) {
    return next(err)
  }

  res.status(500)

  if (req.accepts('html')) {
    res.send('Internal Server Error. Request identifier: ' + req.id)
    return next(err)
  }

  if (req.accepts('json')) {
    res.json({ error: 'Internal Server Error', requestId: req.id })
    return next(err)
  }

  res.type('txt').send('Internal Server Error. Request identifier: ' + req.id)

  next(err)
})

function start() {
  var port = process.env.PORT || 3000

  const listener = server.listen(port, function(err) {
    if (err) return reporter.error(err, {fatal: true})

    log.info({port: port}, 'listening on %s', port)

    const protocol = process.env.USE_HTTPS === '1' ? 'https' : 'http'
    const address = listener.address().family === 'IPv6' ? `[${listener.address().address}]` : listener.address().address
    console.info('----\n==> ✅  %s is running', 'Daheim App API')
    console.info('==> 💻  Open %s://%s:%s in a browser to view the app.', protocol, address, listener.address().port)
  })
  server.on('error', function(err) {
    reporter.error(err)
  })
  return server
}

module.exports = {
  app: app,
  start: start,
}

start()
