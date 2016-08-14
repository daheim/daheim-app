import {applyMiddleware} from 'redux'
import thunkMw from 'redux-thunk'
import promiseMw from './promise'
import {routerMiddleware} from 'react-router-redux'
import {liveMiddleware} from '../live'
import createApiMiddleware from './api'
import createFacebookMiddleware from './facebook'

export default function createMiddleware (history, api) {
  return applyMiddleware(createApiMiddleware(api), promiseMw, thunkMw, routerMiddleware(history), liveMiddleware, createFacebookMiddleware())
}
