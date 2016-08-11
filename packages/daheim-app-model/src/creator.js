import mongoose from 'mongoose'
import Bluebird from 'bluebird'
import './model'

mongoose.Promise = Bluebird

export function getMongoDBUrlFromEnv () {
  if (process.env.MONGODB_URL) {
    return process.env.MONGODB_URL
  } else if (process.env.MONGODB_PORT_27017_TCP_PORT && process.env.MONGODB_PORT_27017_TCP_ADDR) {
    if (!process.env.MONGODB_DB_NAME || process.env.MONGODB_DB_NAME === '**ChangeMe**') {
      throw new Error('MONGODB_DB_NAME must be defined when mongodb is linked')
    }
    return `mongodb://${process.env.MONGODB_PORT_27017_TCP_ADDR}:${process.env.MONGODB_PORT_27017_TCP_PORT}/${process.env.MONGODB_DB_NAME}`
  }
  return 'mongodb://localhost/first'
}

export function connect(url, cb) {
  mongoose.connect(url, {
    server: {reconnectTries: Infinity},
    db: {bufferMaxEntries: 0}
  }, cb)
  return mongoose
}
