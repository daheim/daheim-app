import {createAction} from 'redux-actions'

export const SHOW_MESSAGE = 'SHOW_MESSAGE'
export const showMessage = createAction(SHOW_MESSAGE)

export const CLOSE_MESSAGES = 'CLOSE_MESSAGES'
export const closeMessages = createAction(CLOSE_MESSAGES)

