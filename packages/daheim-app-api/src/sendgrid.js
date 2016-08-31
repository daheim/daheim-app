import axios from 'axios'

import log from './log'

export class EmailSender {
  static defaultEndpoint = 'https://api.sendgrid.com/v3/mail/send'

  constructor ({sendgridKey, from, fromName, endpoint} = {}) {
    if (!sendgridKey) return log.warn('SendGrid integration disabled')
    this.sendgridKey = sendgridKey
    this.from = from || 'hilfe@willkommen-daheim.org'
    this.fromName = fromName || 'Daheim Hilfebereich'
    this.endpoint = endpoint || EmailSender.defaultEndpoint
  }

  async send ({to, subject, html, sandboxMode}) {
    if (!this.sendgridKey) return log.warn(`Cannot send email to ${to}`)

    try {
      const body = {
        personalizations: [{
          to: [{email: to}],
          subject
        }],
        from: {email: this.from, name: this.fromName},
        content: [{
          type: 'text/html',
          value: html
        }]
      }
      if (sandboxMode) {
        body.mail_settings = {sandbox_mode: {enable: true}}
      }
      await axios.post(this.endpoint, body, {
        headers: {
          'Authorization': `Bearer ${this.sendgridKey}`,
          'Content-Type': 'application/json'
        }
      })
    } catch (err) {
      const data = err.response && err.response.data
      const status = err.response && err.response.status
      log.error({text, data, status, err}, 'cannot send email')
      throw err
    }
  }
}

export default new EmailSender({
  sendgridKey: process.env.SENDGRID_KEY,
  from: process.env.SENDGRID_FROM,
  fromName: process.env.SENDGRID_FROM_NAME
})
