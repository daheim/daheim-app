import 'babel-polyfill'
import SourceMapSupport from 'source-map-support'
import './reporter'
import Bluebird from 'bluebird'

require('babel-runtime/core-js/promise').default = Bluebird

SourceMapSupport.install()

Bluebird.config({
  longStackTraces: true,
  warnings: process.env.NODE_ENV === 'development'
})
