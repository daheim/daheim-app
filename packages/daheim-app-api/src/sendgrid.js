import Bluebird from 'bluebird'
import createSendgrid from 'sendgrid'

import log from './log'

export class EmailSender {
  constructor ({sendgridKey, from, fromName} = {}) {
    if (!sendgridKey) return log.warn('SendGrid integration disabled')
    const sendgrid = this.sendgrid = createSendgrid(process.env.SENDGRID_KEY)
    this.from = from || 'hilfe@willkommen-daheim.org'
    this.fromName = fromName || 'Daheim Hilfebereich'

    Bluebird.promisifyAll(sendgrid)
  }

  send ({to, subject, html}) {
    if (!this.sendgrid) return log.warn(`Cannot send email to ${to}`)

    let mail = new this.sendgrid.Email({
      to,
      subject,
      html,
      from: this.from,
      fromname: this.fromName
    })
    return this.sendgrid.sendAsync(mail)
  }
}

export default new EmailSender({
  sendgridKey: process.env.SENDGRID_KEY,
  from: process.env.SENDGRID_FROM,
  fromName: process.env.SENDGRID_FROM_NAME
})
