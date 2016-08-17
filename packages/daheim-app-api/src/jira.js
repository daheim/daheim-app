import axios from 'axios'
import log from './log'

export function createJiraAxe ({url, username, password}) {
  if (!url || !username || !password) {
    log.warn('JIRA integration disabled')
    return null
  }

  const authbase64 = (new Buffer(`${username}:${password}`)).toString('base64')
  return axios.create({
    baseURL: url,
    headers: {
      'Authorization': `Basic ${authbase64}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
}

export default createJiraAxe({
  url: process.env.JIRA_URL,
  username: process.env.JIRA_USERNAME,
  password: process.env.JIRA_PASSWORD
})
