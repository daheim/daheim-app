import { handleActions } from 'redux-actions'

import { SHOW_MESSAGE, CLOSE_MESSAGES } from '../actions/messages'

const handlers = handleActions({
  [SHOW_MESSAGE]: (state, action) => {
    const description = action.payload
    return {
      ...state,
      current: description,
      open: true
    }
  },
  [CLOSE_MESSAGES]: (state, action) => {
    return {
      ...state,
      open: false
    }
  }
}, {
  current: {},
  open: false
})

function promiseHandler (state, action) {
  if (action.error && action.payload && action.payload.message) {
    return {
      ...state,
      current: {
        message: action.payload.message
      },
      open: true
    }
  }
  return state
}

export default function (state, action) {
  state = promiseHandler(state, action)
  state = handlers(state, action)
  return state
}
