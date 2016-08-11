import createApiAction from './createApiAction'

export const LOGIN = 'auth.login'
export const login = createApiAction(LOGIN)

export const REGISTER = 'auth.register'
export const register = createApiAction(REGISTER)

export const FORGOT = 'auth.requestNewPassword'
export const forgot = createApiAction(FORGOT)

export const RESET = 'auth.resetPassword'
export const reset = createApiAction(RESET)

export const LOGOUT = 'auth.logout'
export const logout = createApiAction(LOGOUT)

export const CHANGE_PASSWORD = 'auth.changePassword'
export const changePassword = createApiAction(CHANGE_PASSWORD)
