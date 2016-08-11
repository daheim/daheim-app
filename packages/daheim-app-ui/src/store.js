import { createStore, compose } from 'redux'
import reducers from './reducers'
import createMiddleware from './middlewares'

export default function createStoreFn (history, api, state) {
  const devtools = window.devToolsExtension ? window.devToolsExtension() : (f) => f
  const middlewares = createMiddleware(history, api)
  const store = createStore(reducers, state, compose(middlewares, devtools))
  return store
}
