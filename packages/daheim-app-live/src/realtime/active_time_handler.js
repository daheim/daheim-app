import {ActiveTime} from '../model'
import moment from 'moment'

const debug = require('debug')('dhm:realtime:ActiveTimeHandler') // eslint-disable-line no-unused-vars

const DAY_MS = 1000 * 60 * 60 * 24
const WEEK_MS = DAY_MS * 7

class ActiveTimeHandler {

  async onConnect (socket) {
    const {user} = socket
    const now = moment.utc()
    const day = now.day()
    const hour = now.hour()

    let activeTime = await ActiveTime.findById(user.id)
    if (!activeTime) {
      activeTime = new ActiveTime({_id: user.id})
    }
    const index = `d${day}h${hour}`
    const cur = activeTime.timetable[index]

    // day magic to handle mid-hour situations
    if (!cur.ping || cur.ping < now - DAY_MS) {
      const oldScore = cur.score
      const weeksAgo = cur.ping ? Math.ceil((now.valueOf() - DAY_MS - cur.ping) / WEEK_MS) : 0
      cur.ping = now.toDate()
      cur.score = (cur.score || 0) / Math.pow(2, weeksAgo) + 0.5
      debug('user %s visited at %s %s weeks ago. old score: %s. new score: %s', activeTime._id, index, weeksAgo, oldScore, cur.score)
    }

    activeTime.save() // async update
  }
}

export default new ActiveTimeHandler()
