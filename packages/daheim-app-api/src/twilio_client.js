import createTwilioClient from 'twilio'
import Promise from 'bluebird'

import log from './log'

const client = (() => {
  if (process.env.TWILIO_SID && process.env.TWILIO_TOKEN) {
    const client = createTwilioClient(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
    Promise.promisifyAll(client)
    Promise.promisifyAll(client.tokens)
    return client
  } else {
    log.warn('no TWILIO_SID and TWILIO_TOKEN env vars defined')
    return null
  }
})()

export default client
