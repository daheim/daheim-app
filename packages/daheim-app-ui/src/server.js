import './optional_newrelic'
import Express from 'express'
import http from 'http'
import spdy from 'spdy'
import fs from 'fs'
import React from 'react'
import ReactDOM from 'react-dom/server'
import httpProxy from 'http-proxy'
import cookieParser from 'cookie-parser'
import path from 'path'
import request from 'request-promise'
import cookie from 'cookie'
import raven from 'raven'
import bowser from 'bowser'

import universal from './universal'
import Html from './html'

process.on("unhandledRejection", function(reason, promise) {
  console.error('unhandled rejection', reason)
})

if (process.env.RAVEN_PRIVATE_DSN) {
  const ravenClient = new raven.Client(process.env.RAVEN_PRIVATE_DSN)
  ravenClient.patchGlobal()
}

const app = new Express()

if (process.env.RAVEN_PRIVATE_DSN) {
  app.use(raven.middleware.express.requestHandler(process.env.RAVEN_PRIVATE_DSN))
}

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

const targetUrl = process.env.API_URL
const proxy = httpProxy.createProxyServer({ target: targetUrl, secure: process.env.INSECURE_API_PROXY !== '1' })

app.use(cookieParser())
app.use('/dist', Express.static(path.join(__dirname, '..', 'build')))
app.use(Express.static(path.join(__dirname, '..', 'static')))

app.use('/api', (req, res) => {
  proxy.web(req, res, { target: targetUrl })
})

proxy.on('error', (error, req, res) => {
  let json
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error)
  }
  if (!res.headersSent) {
    res.writeHead(500, { 'content-type': 'application/json' })
  }

  json = { error: 'proxy_error', reason: error.message }
  res.end(JSON.stringify(json))
})

app.use(async (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    universal.refresh()
  }

  let state = {}

  try {
    if (!req.cookies.sid) { // to avoid spamming the API server with 401s
      const e = new Error('no session id cookie')
      e.statusCode = 401
      throw e
    }

    const profile = JSON.parse(await request({
      url: targetUrl + '/profile',
      strictSSL: process.env.INSECURE_API_PROXY !== '1',
      headers: {
        'Cookie': cookie.serialize('sid', req.cookies.sid)
      }
    }))
    state.profile = {profile}
  } catch (err) {
    if ((req.originalUrl !== '/auth' && req.originalUrl !== '/auth/register' && req.originalUrl.indexOf('/auth/reset') !== 0) && err.statusCode === 401) {
      res.redirect('/auth')
      return
    }
    // TODO: handle cannot load profile
  }

  try {
    state.browser = bowser._detect(req.headers['user-agent'])
    const store = {getState: () => state}

    // const store = createStore(history, client)

    function hydrateOnClient () {
      res.send('<!doctype html>\n' +
        ReactDOM.renderToString(<Html assets={universal.assets()} store={store} />))
    }

    hydrateOnClient()
  } catch (err) {
    next(err)
  }
})

if (process.env.RAVEN_PRIVATE_DSN) {
  app.use(raven.middleware.express.errorHandler(process.env.RAVEN_PRIVATE_DSN))
}

const listener = server.listen(process.env.PORT || 8080, (err) => {
  if (err) {
    console.error(err)
  }
  const protocol = process.env.USE_HTTPS === '1' ? 'https' : 'http'
  const address = listener.address().family === 'IPv6' ? `[${listener.address().address}]` : listener.address().address
  console.info('----\n==> ✅  %s is running, talking to API server on %s.', 'Daheim App UI', targetUrl)
  console.info('==> 💻  Open %s://%s:%s in a browser to view the app.', protocol, address, listener.address().port)
})

