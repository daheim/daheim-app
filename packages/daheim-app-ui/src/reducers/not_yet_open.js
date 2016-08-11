import {handleActions} from 'redux-actions'

import {HYDRATE_NOT_YET_OPEN, ACCEPT_NOT_YET_OPEN} from '../actions/not_yet_open'

export default handleActions({
  [HYDRATE_NOT_YET_OPEN]: (state, action) => {
    return {...state, ...action.payload}
  },
  [ACCEPT_NOT_YET_OPEN]: (state, action) => {
    return {...state, accepted: true}
  }
}, {
  accepted: false
})
