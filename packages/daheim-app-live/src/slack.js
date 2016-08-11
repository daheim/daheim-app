import axios from 'axios'
import log from './log'

class Slack {

  constructor () {
    const webhookUrl = this.webhookUrl = process.env.SLACK_WEBHOOK_URL
    if (!webhookUrl) return log.warn('Slack integration disabled')
  }

  async sendText (text) {
    if (!this.webhookUrl) return

    try {
      await axios.post(this.webhookUrl, {text})
    } catch (err) {
      const data = err.response && err.response.data
      const status = err.response && err.response.status

      log.error({text, data, status, err}, 'cannot post to Slack')
    }
  }

}

export default new Slack()
