import tokenHandler from '../token_handler'
import sioError from './sio_error'
import {User} from '../model'
import onlineRegistry from './online_registry'
import lessonRegistry from './lesson_registry'

const debug = require('debug')('dhm:realtime:AuthHandler')

class AuthHandler {

  async auth (socket, accessToken) {
    let userId
    try {
      userId = tokenHandler.verifyRealtimeToken(accessToken)
    } catch (err) {
      throw sioError('unauthorized')
    }

    const user = await User.findById(userId)
    if (!user) throw sioError('unauthorized')

    socket.userId = user.id
    socket.user = user
  }

  middleware = async (socket, next) => {
    const accessToken = socket.request._query.access_token
    try {
      await this.auth(socket, accessToken)
      next()
    } catch (err) {
      if (err.sio) return next(err)
      next(new Error('internalServerError'))
    }
  }

  onConnect (socket) {
    onlineRegistry.onUserOnline(socket)
    lessonRegistry.sendState(socket.userId)
  }

  async '$ready' (socket, {ready, topic}) {
    if (ready) onlineRegistry.onUserReady(socket, {topic})
    else onlineRegistry.onUserNotReady(socket)
    return {}
  }

  onDisconnect (socket) {
    onlineRegistry.onSocketDisconnect(socket)
  }

}

export default new AuthHandler()
