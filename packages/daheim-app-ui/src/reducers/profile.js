import {handleActions} from 'redux-actions'

import {
  LOAD,
  SWITCH_ROLE,
  SAW_RULES,
  SAVE
} from '../actions/profile'
import {
  LOGIN,
  REGISTER
} from '../actions/auth'

function updateProfile (state, action) {
  if (action.error) return {...state, error: action.payload.message}
  if (!action.payload) return state
  const profile = action.payload
  return {
    ...state,
    loading: false,
    profile
  }
}

function updateProfile2 (state, action) {
  if (action.error) return {...state, error: action.payload.message}
  if (!action.payload) return state
  const payload = action.payload
  return {
    ...state,
    loading: false,
    profile: payload.user
  }
}

function updateAfterAuth (state, action) {
  if (action.error) return {...state, error: action.payload.message}
  if (!action.payload) return state
  const {profile} = action.payload
  return {
    ...state,
    loading: false,
    profile
  }
}

export default handleActions({
  [LOAD]: updateProfile,
  [SWITCH_ROLE]: updateProfile,
  [SAW_RULES]: updateProfile,
  [SAVE]: updateProfile2,

  [REGISTER]: updateAfterAuth,
  [LOGIN]: updateAfterAuth
}, {
  profile: undefined,
  loading: true,
  error: null
})
