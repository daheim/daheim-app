import webPush from 'web-push'
import log from '../log'
import restError from '../restError'
import Bluebird from 'bluebird'
import uuid from 'node-uuid'

webPush.setGCMAPIKey(process.env.GCM_API_KEY)

export default (def) => {
  def('/notifications.test', async (req, res) => {
    const {endpoint, userPublicKey, userAuth} = req.body
    try {
      await webPush.sendNotification(endpoint, {
        TTL: 60 * 2,
        payload: JSON.stringify({
          type: 'test'
        }),
        userPublicKey,
        userAuth
      })
    } catch (err) {
      const {statusCode, headers, body} = err
      log.error({err, statusCode, headers, body}, 'cannot send webpush notification')
    }
    return {}
  })

  def('/notifications.testBroadcast', async (req, res) => {
    const proms = req.user.notifications.endpoints.map((def) => webPush.sendNotification(def.endpoint, {
      TTL: 60 * 2,
      payload: JSON.stringify({
        type: 'testBroadcast',
        endpointId: def.id
      }),
      userPublicKey: def.userPublicKey,
      userAuth: def.userAuth
    }).catch((err) => {
      const {statusCode, headers, body} = err
      if (statusCode >= 200 && statusCode < 300) return ''
      if (statusCode === 400 || statusCode === 410) return 'remove'
      log.error({err, statusCode, headers, body}, 'cannot send webpush notification')
      return 'unknown'
    }))

    const results = await Bluebird.all(proms)

    let modified = false
    for (let x = 0; x < results.length; x++) {
      if (results[x] === 'remove') {
        req.user.notifications.endpoints.splice(x, 1)
        results.splice(x, 1)
        x--
        modified = true
      }
    }
    if (modified) await req.user.save()

    return {}
  })

  def('/notifications.register', async (req, res) => {
    const {type} = req.body
    if (type !== 'webpush') throw restError({code: 'invalid-type', message: 'Only webpush notifications are supported'})

    const userAgent = req.headers['user-agent']
    const {endpoint, userPublicKey, userAuth} = req.body
    const found = req.user.notifications.endpoints.find((def) => def.endpoint === endpoint)
    if (found) {
      if (!found.id) found.id = uuid.v4()
      found.userPublicKey = userPublicKey
      found.userAuth = userAuth
      found.userAgent = userAgent
    } else {
      const id = uuid.v4()
      req.user.notifications.endpoints.push({id, endpoint, userPublicKey, userAuth, userAgent})
    }
    req.user.notifications.enabled = true
    await req.user.save()
    return req.user
  })
}
