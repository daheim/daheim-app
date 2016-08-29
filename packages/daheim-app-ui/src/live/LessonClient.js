/* eslint-env browser */

import uuid from 'node-uuid'

import Negotiator from './Negotiator'
import {setState} from '../actions/live'
const debug = require('debug')('dhm:live:LessonClient')

export default class LessonClient {

  constructor (live, id) {
    this.live = live
    this.id = id

    this.backoff = 1000
  }

  close () {
    this.resetBackoff()
    if (this.negotiator) {
      this.negotiator.close()
      delete this.negotiator
    }
    debug('[%s] closed', this.id)
  }

  handleConnectionChange ({connected}) {
    debug('[%s] connection change; connected: %s', this.id, !!connected)

    if (connected && !this.negotiator) {
      this.resetBackoff()
      this.askForNegotiation()
    }
  }

  startBackoff () {
    if (this.backoffTimeout) return
    const timeout = Math.floor(this.backoff + this.backoff * Math.random())
    debug('[%s] starting backoff of %s ms', this.id, timeout)
    this.backoff = Math.min(this.backoff * 2, 60000)
    this.backoffTimeout = setTimeout(() => {
      delete this.backoffTimeout
      this.askForNegotiation()
    }, timeout)
  }

  resetBackoff () {
    debug('[%s] resetting backoff timer', this.id)
    if (this.backoffTimeout) clearTimeout(this.backoffTimeout)
    this.backoff = 1000
  }

  async askForNegotiation () {
    if (this.negotiationStarting) {
      debug('[%s] not allowing new negotiation while another one is being started', this.id)
      return
    }
    this.negotiationStarting = true

    try {
      const negotiationId = uuid.v4()
      const pri = this.pri = Math.floor(Math.random() * 2147483647)

      this.createNegotiator({negotiationId})
      const wannaInitiate = Math.random() < 0.5
      debug('[%s] i want to start negotiation. negotiationId: %s. my pri: %s. wannaInitiate: %s', this.id, negotiationId, pri, wannaInitiate)
      await this.relay({type: 'startNegotiation', negotiationId, pri, wannaInitiate}) // TODO: need timeout
      debug('[%s] i am allowed to start negotiation', this.id)
      this.startNegotiator({initiator: wannaInitiate, negotiationId})
    } catch (err) {
      debug('[%s] i am not allowed to start negotiation', this.id, err)

      if (err.error === 'equalPri') setImmediate(() => this.askForNegotiation())
      else if (err.error !== 'lowerPri') this.startBackoff()
    } finally {
      this.negotiationStarting = false
    }
  }

  relay (data) {
    if (!this.live.socket) throw new Error('socket not active')
    return this.live.relay({id: this.id, data})
  }

  getIceServers () {
    return this.live.getIceServers({id: this.id})
  }

  handleRelay (data, cb) {
    const {type} = data
    if (type === 'startNegotiation') {
      const {pri, negotiationId, wannaInitiate} = data
      debug('[%s] other side wants to start negotiation. my negotiationStarting: %s. my pri: %s. other pri: %s. wannaInitiate: %s', this.id, !!this.negotiationStarting, this.pri, pri, wannaInitiate)

      if (this.negotiationStarting) {
        if (pri === this.pri) {
          debug('[%s] other side should not negotiate because pris are equal', this.id)
          cb({error: 'equalPri'})
          return
        } else if (pri < this.pri) {
          debug('[%s] other side should not negotiate because its pri is inferior', this.id)
          cb({error: 'lowerPri'})
          return
        }
      }

      debug('[%s] other side may start negotiation', this.id)
      this.createNegotiator({negotiationId})
      cb({})
      this.startNegotiator({initiator: !wannaInitiate, negotiationId})
    } else if (Negotiator.RELAY_TYPES[type]) {
      try {
        if (!this.negotiator) {
          debug('[%s] relay received while no negotiation in progress. data: %j', this.id, data)
          throw new Error('no negotiation in progress')
        }
        const result = this.negotiator.handleRelay(data) // TODO: make async
        cb(result)
      } catch (err) {
        cb({error: err.message}) // TODO: use special error type
      }
    } else {
      cb({error: 'invalid relayed message type'})
    }
  }

  createNegotiator ({negotiationId}) {
    if (this.negotiator) this.negotiator.close()

    const relay = (data) => this.relay(data)
    const getIceServers = () => this.getIceServers()
    const negotiator = this.negotiator = new Negotiator({negotiationId, relay, getIceServers})
    negotiator.onError = (err) => {
      if (negotiator !== this.negotiator) return
      this.onNegotiatorError(err)
    }
    negotiator.onProgress = () => {
      if (negotiator !== this.negotiator) return

      const up = {}
      if (negotiator.localStream) up.localStreamUrl = URL.createObjectURL(negotiator.localStream)
      if (negotiator.remoteStream) up.remoteStreamUrl = URL.createObjectURL(negotiator.remoteStream)
      this.dispatch(up)
    }
  }

  onNegotiatorError (err) {
    debug('[%s] negotiation error', this.id, err)
    this.dispatch({localStreamUrl: undefined, remoteStreamUrl: undefined})
    this.startBackoff()
  }

  async startNegotiator ({initiator, negotiationId}) {
    if (!this.negotiator) {
      debug('[%s] trying to start non-existant negotiator', this.id)
      return
    }
    if (this.negotiator.negotiationId !== negotiationId) {
      debug('[%s] startNegotiator negotiationId mismatch; negotiator negotiationId: %s; requested negotiationId: %s', this.id, this.negotiator.negotiationId, negotiationId)
      return
    }

    try {
      const negotiator = this.negotiator
      await negotiator.start({initiator})
      if (this.negotiator !== negotiator) return
      this.resetBackoff()
    } catch (err) {
      // also indicated by onNegotiatorError
    }
  }

  dispatch (opt) {
    const state = this.live.store.getState().live
    const lesson = state.lessons[this.id]
    const lessons = {
      ...state.lessons,
      [this.id]: {
        ...lesson,
        ...opt
      }
    }
    return this.live.store.dispatch(setState({lessons}))
  }

}
