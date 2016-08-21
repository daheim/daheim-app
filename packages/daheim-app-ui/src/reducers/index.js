import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'

import messages from './messages'
import profile from './profile'
import users from './users'
import lessons from './lessons'
import notYetOpen from './not_yet_open'
import {liveReducer} from '../live'
import {serviceWorkerReducer} from '../middlewares/service_worker'

export default combineReducers({
  messages,
  profile,
  users,
  lessons,
  notYetOpen,
  live: liveReducer,
  routing: routerReducer,
  browser: (state, action) => state || {},
  serviceWorker: serviceWorkerReducer
})
