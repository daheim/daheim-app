import {createAction} from 'redux-actions'

export const HYDRATE_NOT_YET_OPEN = 'notYetOpen.hydrate'
export const hydrateNotYetOpenAction = createAction(HYDRATE_NOT_YET_OPEN)
export const hydrateNotYetOpen = () => (dispatch) => {
  if (window && window.sessionStorage && window.sessionStorage.notYetOpenAccepted === '1') {
    dispatch(hydrateNotYetOpenAction({accepted: true}))
  }
}

export const ACCEPT_NOT_YET_OPEN = 'notYetOpen.accept'
export const acceptNotYetOpenAction = createAction(ACCEPT_NOT_YET_OPEN)
export const acceptNotYetOpen = () => (dispatch) => {
  try {
    if (window && window.sessionStorage) window.sessionStorage.notYetOpenAccepted = '1'
  } catch (err) {
    // e.g. iPad throws QuotaExceeded exception, just ignore
  }
  dispatch(acceptNotYetOpenAction())
}
