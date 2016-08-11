import axios from 'axios'
import log from './log'

class Mailchimp {

  constructor () {
    const apikey = process.env.MAILCHIMP_API_KEY
    if (!apikey) return log.warn('MailChimp integration disabled')

    const dc = apikey.split('-')[1]

    this.axe = axios.create({
      baseURL: `https://${dc}.api.mailchimp.com/3.0`,
      headers: {'Authorization': `apikey ${apikey}`}
    })
  }

  async addMemberIfNew ({email, firstName} = {}) {
    if (!this.axe) return

    const listId = process.env.MAILCHIMP_LIST_ID

    try {
      const result = await this.axe.post(`/lists/${listId}/members`, {
        email_address: email,
        status: 'pending',
        merge_fields: {FNAME: firstName},
        language: 'de',
        location: {
          latitude: 53.637954,
          longitude: 8.784784
        },
        vip: true
      })
    } catch (err) {
      if (err.response && err.response.data) {
        const {title} = err.response.data
        if (title === 'Member Exists') return
      }

      const data = err.response && err.response.data
      const status = err.response && err.response.status

      log.error({listId, data, status}, 'cannot add member to MailChimp list')
    }
  }

}

export default new Mailchimp()
