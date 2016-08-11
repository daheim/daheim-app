const $servers = Symbol()

export default class IceServerProvider {

  constructor ({useDefaultServers = true, servers = []} = {}) {
    this[$servers] = []
    if (useDefaultServers) {
      this[$servers].push({url: 'stun:stun.l.google.com:19302'})
      this[$servers].push({url: 'stun:global.stun.twilio.com:3478?transport=udp'})
    }
    for (let server of servers) {
      this[$servers].push(server)
    }
  }

  async get () {
    return this[$servers]
  }

}
