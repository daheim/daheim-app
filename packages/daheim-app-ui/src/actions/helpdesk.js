import createApiAction from './createApiAction'

export const CREATE_TICKET = 'helpdesk.createTicket'
export const createTicket = createApiAction(CREATE_TICKET)

export const REPORT_USER = 'helpdesk.reportUser'
export const reportUser = createApiAction(REPORT_USER)
