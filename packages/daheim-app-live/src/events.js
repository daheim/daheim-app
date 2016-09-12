import createDebug from 'debug'
import log from './log'
import axios from 'axios'
import qs from 'qs'
import Mixpanel from 'mixpanel'

const debug = createDebug('dhm:Events')

export class Events {
  constructor ({console, gaTrackingId, mixpanelToken} = {}) {
    if (console) this.console = true
    this.gaTrackingId = gaTrackingId
    if (mixpanelToken) this.mixpanel = Mixpanel.init(mixpanelToken)
  }

  async track (e) {
    if (this.console) this.emitConsole(e)
    if (this.gaTrackingId) this.emitGoogleAnalytics(e)
    if (this.mixpanel) this.emitMixpanel(e)
  }

  emitConsole (event) {
    log.info({event}, 'event')
  }

  async emitGoogleAnalytics (event) {
    const {userId, category, action} = event
    if (!userId || !category || !action) return

    await axios.post('https://www.google-analytics.com/collect', {
      v: 1,
      tid: this.gaTrackingId,
      cid: userId,
      t: 'event',
      ec: category,
      ea: action
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      transformRequest: [(o) => qs.stringify(o)]
    })
  }

  async emitMixpanel (event) {
    const {userId, category, action, ...rest} = event
    if (!userId || !category || !action) return

    this.mixpanel.track(`${category}.${action}`, {
      distinct_id: userId,
      ...rest
    })
  }
}

export default new Events({
  console: true,
  gaTrackingId: process.env.GA_TRACKING_ID,
  mixpanelToken: process.env.MIXPANEL_TOKEN
})
