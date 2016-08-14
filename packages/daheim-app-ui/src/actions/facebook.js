import {createAction} from 'redux-actions'

export const CALL_METHOD = 'facebook/callMethod'
export const callMethod = createAction(CALL_METHOD)

function createCallMethodAction (method) {
  return createAction(CALL_METHOD, (...args) => ({method, args}))
}

export const init = createCallMethodAction('init')
export const login = createCallMethodAction('login')
