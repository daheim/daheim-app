// to avoid newrelic's warning for dev environments
if (process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic')
}
