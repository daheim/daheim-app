require('babel-polyfill')
require('bluebird').config({longStackTraces: false})
require('babel-runtime/core-js/promise').default = require('bluebird')
require('./reporter')
