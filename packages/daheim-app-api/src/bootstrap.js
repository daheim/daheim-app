import 'babel-polyfill'
import SourceMapSupport from 'source-map-support'
import './reporter'
import Bluebird from 'bluebird'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

require('babel-runtime/core-js/promise').default = Bluebird

SourceMapSupport.install()

Bluebird.config({
  longStackTraces: true,
  warnings: process.env.NODE_ENV === 'development'
})
Bluebird.promisifyAll(bcrypt)

mongoose.Promise = Bluebird
