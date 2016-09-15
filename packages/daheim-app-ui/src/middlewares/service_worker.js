import {handleActions, createAction} from 'redux-actions'
import {registerNotificationEndpoint} from '../actions/notifications'

export const CALL_METHOD = 'serviceWorker/callMethod'
export const callMethod = createAction(CALL_METHOD)

const SET_STATE = 'serviceWorker/setState'
const setState = createAction(SET_STATE)

function createCallMethodAction (method) {
  return createAction(CALL_METHOD, (...args) => ({method, args}))
}

export const startServiceWorker = createCallMethodAction('start')
export const registerServiceWorker = createCallMethodAction('registerServiceWorker')
export const subscribeToWebPush = createCallMethodAction('subscribeToWebPush')
export const unsubscribeFromWebPush = createCallMethodAction('unsubscribeFromWebPush')

class ServiceWorkerManager {

  constructor (store) {
    this.store = store
  }

  async start () {
    try {
      await this.registerServiceWorker()
      const [sub, permissionState] = await Promise.all([
        this.reg.pushManager.getSubscription(),
        this.reg.pushManager.permissionState({userVisibleOnly: true})
      ])
      this.setState({subscribed: !!sub, permissionState, started: true, available: true})
      if (sub) this.registerEndpoint(sub) // async
    } catch (err) {
      console.error('Cannot start ServiceWorker:', err)
      this.setState({started: true, available: false})
    }
  }

  async registerServiceWorker () {
    if (this.reg) return
    if (!navigator.serviceWorker) throw new Error('Service Workers not supported')

    await navigator.serviceWorker.register('/sw.js')
    const reg = await navigator.serviceWorker.ready
    this.reg = reg
    this.setState({registered: true})
  }

  async subscribeToWebPush () {
    if (!this.reg) await this.registerServiceWorker()
    const sub = await this.reg.pushManager.subscribe({userVisibleOnly: true})
    this.setState({subscribed: true})
    this.registerEndpoint(sub) // async
    return sub
  }

  async getWebPushSubscription () {
    if (!this.reg) await this.registerServiceWorker()
    const sub = await this.reg.pushManager.getSubscription()
    return sub
  }

  async unsubscribeFromWebPush () {
    const sub = await this.getWebPushSubscription()
    if (sub) await sub.unsubscribe()
    this.setState({subscribed: false})
  }

  async registerEndpoint (sub) {
    const {endpoint} = sub
    const userPublicKey = sub.getKey ? window.btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('p256dh')))) : undefined
    const userAuth = sub.getKey ? window.btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('auth')))) : undefined

    return this.store.dispatch(registerNotificationEndpoint({type: 'webpush', endpoint, userPublicKey, userAuth}))
  }

  setState (state) {
    setTimeout(_ => this.store.dispatch(setState(state)))
  }

}

export const serviceWorkerReducer = handleActions({
  [SET_STATE]: (state, action) => {
    return {
      ...state,
      ...action.payload
    }
  }
}, {
  started: false,
  available: false,
  permissionState: '',
  subscribed: false,
  registered: false
})

export default function createServiceWorkerMiddleware () {
  return (store) => (next) => {
    const manager = new ServiceWorkerManager(store)
    return (action) => {
      if (action.type !== CALL_METHOD) return next(action)
      const {payload: {method, args}} = action
      return manager[method](...args)
    }
  }
}
