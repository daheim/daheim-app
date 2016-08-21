import createApiAction from './createApiAction'

export const TEST_NOTIFICATION = 'notifications.test'
export const testNotification = createApiAction(TEST_NOTIFICATION)

export const TEST_NOTIFICATION_BROADCAST = 'notifications.testBroadcast'
export const testNotificationBroadcast = createApiAction(TEST_NOTIFICATION_BROADCAST)

export const REGISTER_NOTIFICATION_ENDPOINT = 'notifications.register'
export const registerNotificationEndpoint = createApiAction(REGISTER_NOTIFICATION_ENDPOINT)
