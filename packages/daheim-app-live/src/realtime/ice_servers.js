import log from '../log'
import twilioClient from '../twilio_client'

const debug = require('debug')('dhm:realtime:IceServers')

class IceServers {
  async get () {
    if (this.requesting) {
      debug('waiting for request to finish')
      await this.requesting
    }

    const now = Date.now()
    const stillValid = this.expires - now
    if (this.servers && stillValid > 0) {
      debug('cached servers still valid for %s ms', stillValid)
      return {iceServers: this.servers}
    }

    try {
      debug('requesting new servers')
      this.requesting = twilioClient.tokens.createAsync({ttl: 10 * 60})
      const {iceServers} = await this.requesting
      this.servers = iceServers
      this.expires = Date.now() + 5 * 60 * 1000
      debug('got new servers:', this.servers)
      return {iceServers: this.servers}
    } catch (err) {
      log.error({err}, 'error getting servers')
      // return fallback servers
      return {
        iceServers: [
          {url: 'stun:stun.l.google.com:19302'},
          {url: 'stun:stun1.l.google.com:19302'},
          {url: 'stun:global.stun.twilio.com:3478?transport=udp'}
        ]
      }
    } finally {
      delete this.requesting
    }
  }
}

export default new IceServers()
