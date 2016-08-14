import {CALL_METHOD} from '../actions/facebook'

class FacebookManager {
  static initPromise = new Promise((resolve) => {
    window.fbAsyncInit = function() {
      FB.init({
        appId: window.__INIT.FB_CLIENT_ID,
        version: 'v2.7'
      })
      FacebookManager.initComplete = true
      delete FacebookManager.initPromise
      resolve()
    }
  })

  constructor (store) {
    this.store = store
  }

  init () {
    if (FacebookManager.initComplete) return Promise.resolve()

    ;(function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) return
      js = d.createElement(s); js.id = id
      js.src = "//connect.facebook.net/en_US/sdk.js"
      fjs.parentNode.insertBefore(js, fjs)
    }(document, 'script', 'facebook-jssdk'))

    return FacebookManager.initPromise
  }

  async login (opt) {
    return new Promise((resolve, reject) => {
      new FB.login((response) => {
        response.authResponse ? resolve(response) : reject(response)
      }, opt)
    })
  }

}

export default function createFacebookMiddleware () {
  return (store) => (next) => {
    const facebookManager = new FacebookManager(store)
    return (action) => {
      if (action.type !== CALL_METHOD) return next(action)
      const {payload: {method, args}} = action
      return facebookManager[method](...args)
    }
  }
}
