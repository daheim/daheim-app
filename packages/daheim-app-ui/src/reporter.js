import Raven from 'raven-js'
import version from './version'

class Reporter {

  start () {
    if (this.started) return
    this.started = true

    const {RAVEN_DSN} = window.__INIT

    if (RAVEN_DSN) {
      Raven
        .config(RAVEN_DSN, {release: version.version})
        .install()
      this.useRaven = true
    }

    window.addEventListener('unhandledrejection', (e) => {
      if (e) {
        e.preventDefault()
        const reason = e.reason || (e.detail && e.detail.reason)
        this.error(reason)
      }
    })

    window.__reporter = this

    return this
  }

  watchStore (store) {
    this.handleStoreChange(store)
    return store.subscribe(() => this.handleStoreChange(store))
  }

  handleStoreChange = (store) => {
    const state = store.getState()
    const {profile} = state.profile
    if (profile) {
      this.setUserContext({id: profile.id, email: profile.username})
    } else {
      this.setUserContext()
    }
  }

  setUserContext (ctx) {
    Raven.setUserContext(ctx)
  }

  error (err) {
    Raven.captureException(err)
    console.error('Exception to Report:', err)
  }

  async testAsyncError () {
    throw new Error('test async error')
  }

  testTimeoutError () {
    setTimeout(() => {
      throw new Error('test timeout error')
    }, 1000)
  }

}

export default new Reporter().start()
