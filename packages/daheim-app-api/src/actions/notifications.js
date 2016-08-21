import webPush from 'web-push'
import log from '../log'

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
}
