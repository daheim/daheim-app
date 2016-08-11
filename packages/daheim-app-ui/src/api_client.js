import ExtendableError from 'es6-error'
import cookie from 'cookie'

export class ApiError extends ExtendableError {
  constructor (message, code) {
    super(`[${code}] ${message}`)
    this.code = code
  }

  async getCode () {
    try {
      const json = await this.response.json()
      return json.code || 'network'
    } catch (err) {
      console.error('Cannot decode JSON error:', err.stack)
      return 'network'
    }
  }
}

class ApiClient {

  get (url) {
    return this.do(url)
  }

  post (url, body) {
    return this.do(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(body)
    })
  }

  postFiles (url, body, files) {
    const formData = new FormData()
    formData.append('json', JSON.stringify(body))
    for (let key of Object.keys(files)) {
      formData.append(key, files[key])
    }

    return this.do(url, {
      method: 'POST',
      body: formData
    })
  }

  async do (url, opt = {}) {
    try {
      const csrfToken = cookie.parse(document.cookie)._csrf
      opt.headers = opt.headers || {}
      opt.headers['Accept'] = 'application/json'
      opt.headers['X-CSRF-Token'] = csrfToken
      opt.credentials = 'same-origin'
      const response = await fetch('/api' + url, opt)
      if (!response.ok) {
        if (response.status === 401) throw new ApiError('Unauthorized', 'unauthorized')
        const json = await response.json()
        const code = json.code || 'network'
        const message = json.error || 'Du hast derzeit keine stabile Internetverbindung. Bitte versuche es später noch einmal.'
        throw new ApiError(message, code)
      }
      return await response.json()
    } catch (err) {
      if (err instanceof ApiError) throw err
      throw new ApiError('Du hast derzeit keine stabile Internetverbindung. Bitte versuche es später noch einmal.', 'network')
    }
  }

}

export default new ApiClient()
