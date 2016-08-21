import webPush from 'web-push'

webPush.setGCMAPIKey(process.env.GCM_API_KEY)

export default (def) => {
  def('/notifications.test', async (req, res) => {
    const {endpoint, userPublicKey, userAuth} = req.body
    await webPush.sendNotification(endpoint, {
      TTL: 60 * 2,
      payload: JSON.stringify({
        type: 'test'
      }),
      userPublicKey,
      userAuth
    })
    return {}
  })
}
