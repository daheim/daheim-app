import io from 'socket.io-client'
import {push} from 'react-router-redux'

import api from '../api_client'
import {setState} from '../actions/live'
import LessonClient from './LessonClient'
const debug = require('debug')('dhm:live:Live')

class Connection {

  async start (configureSocket) {
    try {
      const data = await api.post('/realtimeToken')
      if (this.closed) return
      const accessToken = data.token
      const socket = this.socket = io(window.__INIT.SIO_URL, {
        reconnection: false,
        multiplex: false,
        transports: ['websocket'],
        query: {
          'access_token': accessToken
        }
      }) // TODO: configure URL
      configureSocket(socket)

      socket.on('connect', () => {
        if (this.closed) return
        this.onConnect()
      })
      for (let event of ['disconnect', 'error', 'connect_error', 'connect_timeout', 'reconnect_error', 'reconnect_failed']) {
        socket.on(event, (...args) => {
          if (this.closed) return
          debug('sio connect error. event: %s', ...args)
          const error = args[0] ? (args[0].message ? args[0].message : '' + args[0]) : undefined
          this.close({error})
        })
      }
    } catch (err) {
      debug('sio connect error', err)
      this.close({error: err.message})
    }
  }

  close (...args) {
    if (this.closed) return
    this.closed = true

    if (this.socket) {
      this.socket.close()
      for (let id of Object.keys(this.socket.acks)) {
        this.socket.onack({id, data: [{error: 'disconnected'}]})
      }
    }

    this.onClose(...args)
  }
}

export default class Live {

  static instances = {}

  constructor (store) {
    this.store = store
  }

  lessonClients = {}

  get state () { return this.store.getState().live }
  dispatchState (...args) { return this.store.dispatch(setState(...args)) }

  connect () {
    if (this.connection) this.connection.close({replaced: true})
    const connection = this.connection = new Connection()
    connection.onConnect = () => {
      if (this.connection !== connection) return
      this.socket = connection.socket
      this.dispatchState({connected: true, error: null, ready: false})
      delete this.connectionBackoff
    }
    connection.onClose = ({replaced, error} = {}) => {
      if (this.connection !== connection) return
      delete this.socket
      delete this.connection
      this.dispatchState({connected: false})

      if (replaced) return

      if (error) this.dispatchState({error})

      this.connectionBackoff = Math.floor(Math.min((this.connectionBackoff || 1000) * (1 + Math.random()), 60000))
      debug('sio reconnecting in %s ms', this.connectionBackoff)
      setTimeout(() => this.connect(), this.connectionBackoff)
    }
    connection.start((socket) => this.configureSocket(socket))
  }

  configureSocket (socket) {
    socket.on('online', (online) => this.dispatchState({online}))
    socket.on('readyUsers', (users) => this.dispatchState({readyUsers: users}))

    socket.on('userIsReady', ({topic}) => this.dispatchState({ready: true, readyTopic: topic}))
    socket.on('userIsNotReady', () => this.dispatchState({ready: false}))

    socket.on('Lesson.onUpdated', ({lessons, closedLessons}) => {
      for (let id in lessons) {
        const lesson = lessons[id]
        if (!lesson || lesson.closed) {
          if (this.lessonClients[id]) {
            this.lessonClients[id].close()
            delete this.lessonClients[id]
          }
        }
      }

      this.dispatchState({lessons, closedLessons})
    })

    socket.on('lesson.onConnectionChanged', (req) => {
      const {id, connected} = req
      const lessons = {
        [id]: {
          participating: true,
          connected
        }
      }
      this.dispatchState({lessons})
      this.store.dispatch(push(`/lessons/${id}`))

      if (!this.lessonClients[id]) {
        const lessonClient = new LessonClient(this, id)
        this.lessonClients[id] = lessonClient
      }
      this.lessonClients[id].handleConnectionChange(req)
    })
    socket.on('lesson.relay', ({id, data}, cb) => {
      const lessonClient = this.lessonClients[id]
      if (!lessonClient) return cb({error: 'no client side lesson found'})
      lessonClient.handleRelay(data, cb)
    })

    socket.on('lesson.onRemoved', (req) => {
      const {id} = req

      if (this.lessonClients[id]) {
        this.lessonClients[id].close()
        delete this.lessonClients[id]
      }

      const lessons = {
        [id]: {
          participating: false
        }
      }
      this.dispatchState({lessons})
    })
  }

  replayState () {
    const {ready} = this.state
    if (ready) this.ready({ready})
  }

  async ready ({ready, topic}) {
    if (!this.socket) throw new Error('live not active')

    return new Promise((resolve, reject) => {
      this.socket.emit('ready', {ready, topic}, (res) => {
        if (res.error) return reject(new Error(res.error))
        resolve()
      })
    })
  }

  async startLesson ({userId}) {
    if (!this.socket) throw new Error('live not active')
    return new Promise((resolve) => {
      this.socket.emit('Lesson.create', {userId}, (res) => {
        resolve(res)

        const {id} = res
        const lessons = {
          [id]: {
            id,
            state: 'inviting',
            participating: true
          }
        }
        this.dispatchState({lessons})
      })
    })
  }

  async join ({id}) {
    if (!this.socket) throw new Error('live not active')
    const lesson = this.state.lessons[id]
    if (!lesson) return console.warn('lesson not found in state', id)
    return new Promise((resolve) => {
      this.socket.emit('lesson.join', {id}, (res) => {
        resolve(res)

        const lessons = {
          [id]: {
            participating: true
          }
        }
        this.dispatchState({lessons})
      })
    })
  }

  async leave ({id}) {
    if (!this.socket) throw new Error('live not active')
    this.dispatchState({
      lessons: {
        [id]: undefined
      }
    })
    return new Promise((resolve) => {
      this.socket.emit('lesson.leave', {id}, (res) => {
        resolve(res)
      })
    })
  }

  async leaveIfNotStarted ({id}) {
    const lesson = this.state.lessons[id]
    if (!lesson || !lesson.connected) { // TODO: should check for lesson.active
      return this.leave({id})
    }
  }

  async relay ({id, connectionId, data}) {
    if (!this.socket) throw new Error('live not active')
    return new Promise((resolve, reject) => {
      this.socket.emit('lesson.relay', {id, connectionId, data}, (res) => {
        if ((res || {}).error) return reject(res) // TODO: ugly
        resolve(res)
      })
    })
  }

  async getIceServers ({id}) {
    if (!this.socket) throw new Error('live not active')
    return new Promise((resolve, reject) => {
      this.socket.emit('lesson.getIceServers', {id}, (res) => {
        if ((res || {}).error) return reject(res) // TODO: ugly
        resolve(res)
      })
    })
  }
}
