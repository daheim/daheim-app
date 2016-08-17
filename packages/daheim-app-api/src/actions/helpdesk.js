import axios from 'axios'
import restError from '../restError'
import log from '../log'
import jira from '../jira'

export default (def) => {

  def('/helpdesk.createTicket', async (req, res) => {
    if (!jira || !process.env.JIRA_SERVICE_DESK_ID || !process.env.JIRA_REQUEST_TYPE_ID) throw new Error('JIRA integration disabled')

    const {user} = req
    const {description, environment = 'API'} = req.body
    if (typeof description !== 'string' || !description) throw restError({code: 'field_error', error: 'Description missing', field: 'description'})
    const summary = description.substring(0, 255).replace(/\s+/g, ' ')

    try {
      const ticketRes = await jira.post('/rest/servicedeskapi/request', {
        serviceDeskId: process.env.JIRA_SERVICE_DESK_ID,
        requestTypeId: process.env.JIRA_REQUEST_TYPE_ID,
        requestFieldValues: {summary, description, environment},
        raiseOnBehalfOf: user.username
      })
      const {issueId, issueKey} = ticketRes.data
      log.info({issueId, issueKey}, 'helpdesk ticket created')
    } catch (err) {
      const data = {}
      if (err.response) {
        data.responseStatus = err.response.status
        data.responseData = err.response.data
      } else {
        data.err = err
      }
      log.error(data, 'cannot create helpdesk ticket')
      throw err
    }

    return {}
  })

}
