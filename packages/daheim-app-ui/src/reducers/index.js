import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'

import messages from './messages'
import profile from './profile'
import users from './users'
import lessons from './lessons'
import notYetOpen from './not_yet_open'
import {liveReducer} from '../live'

export default combineReducers({
  messages,
  profile,
  users,
  lessons,
  notYetOpen,
  live: liveReducer,
  routing: routerReducer,
  browser: (state, action) => state || {}
})
