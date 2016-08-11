import {getMongoDBUrlFromEnv, connect} from './creator'
import {log, reporter} from 'daheim-app-utils'

const mongoDBUrl = getMongoDBUrlFromEnv()
log.info({mongodbUrl: mongoDBUrl}, 'connecting to MongoDB')
const mongoose = connect(mongoDBUrl, (err, connIgnored) => {
  if (err) {
    reporter.error(err, {fatal: true})
  }
  mongoose.connection.on('disconnected', (err) => {
    log.warn({err}, 'mongoose disconnected')
  })
})
mongoose.connection.on('connected', (errIgnored) => {
  log.info('mongoose connected')
})

export * from './model'
export avatars from './avatars'
