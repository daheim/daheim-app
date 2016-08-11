import raven from 'raven'
import log from './log'

class Reporter {

  start () {
    if (process.env.RAVEN_PRIVATE_DSN) {
      const ravenClient = this.ravenClient = new raven.Client(process.env.RAVEN_PRIVATE_DSN, {logger: 'default'})
      ravenClient.patchGlobal()

      this.requestHandler = raven.middleware.express.requestHandler(process.env.RAVEN_PRIVATE_DSN)
      this.errorHandler = raven.middleware.express.errorHandler(process.env.RAVEN_PRIVATE_DSN)
    }

    process.on('unhandledRejection', this.handleUnhandledRejection)

    return this
  }

  handleUnhandledRejection = (err) => {
    this.error(err)
  }

  error (err, {fatal} = {}) {
    if (this.ravenClient) this.ravenClient.captureException(err)
    log.error({err}, 'reported exception')
    if (fatal) setTimeout(() => process.exit(1), 2000)
  }

  requestHandler = (req, res, next) => next()
  errorHandler = (err, req, res, next) => next(err)
}

export default new Reporter().start()