import Server from 'socket.io'

import './promisify'
import authHandler from './auth_handler'
import lessonHandler from './lesson_handler'
import log from '../log'
import reporter from '../reporter'

function attachHandlers (socket, ...handlers) {
  // const onevent = socket.onevent
  socket.onevent = async (packet) => {
    const {id, data} = packet
    const [channel] = data

    let handlerFn
    for (let x = 0; x < handlers.length && !handlerFn; x++) handlerFn = handlers[x]['$' + channel]

    if (!handlerFn) {
      log.warn({packet}, 'unhandled message')
      if (id) socket.ack(id)({error: 'unhandled'})
      return
    }

    const args = [...data]
    args[0] = socket

    let result
    try {
      result = await handlerFn.apply(this, args)
    } catch (err) {
      if (err.sio) {
        result = {error: err.sio}
      } else {
        result = {error: 'internalServerError'}
        reporter.error(err)
      }
    }

    if (id != null) {
      if (result === undefined) log.warn({packet}, 'message needs response but none given')
      socket.ack(id)(result)
    } else {
      if (result !== undefined) log.warn({packet, result}, 'message does not need response, but has one')
    }
  }

  socket.on('disconnect', () => {
    for (let x = 0; x < handlers.length; x++) {
      try {
        if (handlers[x].onDisconnect) handlers[x].onDisconnect(socket)
      } catch (err) {
        reporter.error(err)
      }
    }
  })

  for (let handler of handlers) {
    try {
      if (handler.onConnect) handler.onConnect(socket)
    } catch (err) {
      reporter.error(err)
    }
  }
}

const io = new Server()
io.use(authHandler.middleware)
io.on('connection', (socket) => attachHandlers(socket,
  authHandler,
  lessonHandler
))
export default io
