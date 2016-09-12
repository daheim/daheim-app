import io from './io'
import sioError from './sio_error'
import lessonRegistry from './lesson_registry'
import slack from '../slack'
import {User} from 'daheim-app-model'
import webPush from 'web-push'
import log from '../log'
import Bluebird from 'bluebird'
import events from '../events'
import uuid from 'node-uuid'

webPush.setGCMAPIKey(process.env.GCM_API_KEY)

const debug = require('debug')('dhm:realtime:OnlineRegistry') // eslint-disable-line no-unused-vars

const OFFLINE_TIMEOUT = 30 * 1000

class OnlineRegistry {

  students = {}
  teachers = {}
  ready = {}

  onUserOnline (socket) {
    socket.join('authenticated')
    socket.join(`user-${socket.userId}`)

    const {role} = socket.user.profile
    let list
    if (role === 'teacher') {
      socket.join('teachers')
      list = this.teachers[socket.userId] = this.teachers[socket.userId] || {}
    } else if (role === 'student') {
      socket.join('students')
      list = this.students[socket.userId] = this.students[socket.userId] || {}
    }
    if (list) list[socket.id] = socket

    const readyEntry = this.ready[socket.userId]
    if (readyEntry) {
      if (readyEntry.timeout) {
        clearTimeout(readyEntry.timeout)
        delete readyEntry.timeout
      }
      const {topic} = readyEntry
      socket.emit('userIsReady', {topic})
    }

    this.emitOnline()
    this.emitReady()
  }

  onSocketDisconnect (socket) {
    const {students, teachers} = this

    if (students[socket.userId]) {
      delete students[socket.userId][socket.id]
      if (Object.keys(students[socket.userId]).length === 0) delete students[socket.userId]
    }
    if (teachers[socket.userId]) {
      delete teachers[socket.userId][socket.id]
      if (Object.keys(teachers[socket.userId]).length === 0) delete teachers[socket.userId]
    }

    const readyEntry = this.ready[socket.userId]
    if (readyEntry) {
      if (!readyEntry.timeout) {
        if (!io.of('/').adapter.rooms[`user-${socket.userId}`]) { // room is deleted when the last leaves
          readyEntry.timeout = setTimeout(() => {
            delete this.ready[socket.userId]
            this.emitReady()
          }, OFFLINE_TIMEOUT)
        }
      }
    }

    this.emitOnline()
  }

  async onUserReady (socket, {topic} = {}) {
    if (!socket.user) throw sioError('unauthorized')

    if (this.ready[socket.userId]) return // already ready

    const {role} = socket.user.profile
    if (role !== 'student') throw sioError('onlyStudents')

    const readyId = uuid.v4()
    this.ready[socket.userId] = {readyId, topic, date: new Date()}
    io.of('/').in(`user-${socket.userId}`).emit('userIsReady', {topic})
    this.emitReady()

    // emit event
    events.track({
      category: 'lesson',
      action: 'userReady',
      userId: socket.userId,
      readyId
    })

    slack.sendText(`${socket.user.username} is ready for a Gespräch`)
    this.notifyTeachers(socket)
  }

  onUserNotReady (socket) {
    if (!socket.user) throw sioError('unauthorized')

    const entry = this.ready[socket.userId]
    if (!entry) return

    if (entry.timeout) clearTimeout(entry.timeout)
    delete this.ready[socket.userId]

    io.of('/').in(`user-${socket.userId}`).emit('userIsNotReady')
    this.emitReady()
  }

  onLessonsChanged () {
    this.emitReady()
  }

  emitOnline (socket) {
    const online = {
      teachers: Object.keys(this.teachers).length,
      students: Object.keys(this.students).length
    }
    io.of('/').in('authenticated').emit('online', online)
  }

  emitReady (socket) {
    const users = Object.keys(this.ready).filter((id) => !lessonRegistry.users[id]).map((id) => {
      const {topic} = this.ready[id]
      return {id, topic}
    })
    io.of('/').in('teachers').emit('readyUsers', users)
  }

  async notifyTeachers (socket) {
    const {user} = socket
    const teachers = await User.find({'notifications.enabled': true})
    teachers.forEach((teacher) => {
      if (teacher.id === user.id) return
      if (this.teachers[teacher.id]) return
      this.notifyTeacher(socket, teacher)
    })
  }

  async notifyTeacher (socket, teacher) {
    console.log('notifying', teacher)
    const proms = teacher.notifications.endpoints.map((def) => webPush.sendNotification(def.endpoint, {
      TTL: 60 * 2,
      payload: JSON.stringify({type: 'studentWaiting', studentId: socket.user.id}),
      userPublicKey: def.userPublicKey,
      userAuth: def.userAuth
    }).catch((err) => {
      const {statusCode, headers, body} = err
      if (statusCode >= 200 && statusCode < 300) return ''
      if (statusCode === 400 || statusCode === 410) return 'remove'
      log.error({err, statusCode, headers, body}, 'cannot send webpush notification')
      return 'unknown'
    }))

    const results = await Bluebird.all(proms)
    console.log(results)

    let modified = false
    for (let x = 0; x < results.length; x++) {
      if (results[x] === 'remove') {
        teacher.notifications.endpoints.splice(x, 1)
        results.splice(x, 1)
        x--
        modified = true
      }
    }
    if (modified) await teacher.save()
  }

}

export default new OnlineRegistry()
