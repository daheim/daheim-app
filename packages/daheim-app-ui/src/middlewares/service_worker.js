import {handleActions, createAction} from 'redux-actions'

export const CALL_METHOD = 'serviceWorker/callMethod'
export const callMethod = createAction(CALL_METHOD)

const SET_STATE = 'serviceWorker/setState'
const setState = createAction(SET_STATE)

function createCallMethodAction (method) {
  return createAction(CALL_METHOD, (...args) => ({method, args}))
}

export const registerServiceWorker = createCallMethodAction('registerServiceWorker')
export const subscribeToWebPush = createCallMethodAction('subscribeToWebPush')
export const unsubscribeFromWebPush = createCallMethodAction('unsubscribeFromWebPush')

class ServiceWorkerManager {

  constructor (store) {
    this.store = store
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
    return sub
  }

  async getWebPushSubscription () {
    if (!this.reg) await this.registerServiceWorker()
    const sub = await this.reg.pushManager.getSubscription()
    return sub
  }

  async unsubscribeFromWebPush () {
    const sub = await this.getWebPushSubscription()
    console.log('sub', sub)
    if (!sub) return
    await sub.unsubscribe()
  }

  setState (state) {
    this.store.dispatch(setState(state))
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
