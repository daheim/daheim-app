/* eslint-env serviceworker */

const config = JSON.parse('{{CONFIG}}')
console.log('start', self, config)

self.addEventListener('install', function (event) {
  self.skipWaiting()
  console.log('install', event)
})

self.addEventListener('activate', function (event) {
  console.log('activate', event)
})

self.addEventListener('pushsubscriptionchange', function (event) {
  console.log('pushsubscriptionchange', event)
})

self.addEventListener('notificationclick', function (event) {
  console.log('notificationclick', event)
  event.notification.close()

  const prom = self.clients.matchAll({type: 'window'}).then(function (clients) {
    console.log('clients', clients)
    for (var i = 0; i < clients.length; i++) {
      var client = clients[i]
      if (client.focus) return client.focus()
    }
    if (self.clients.openWindow) return self.clients.openWindow(self.location.origin)
  })
  event.waitUntil(prom)
})

self.addEventListener('push', function (event) {
  const data = event.data ? event.data.json() : {}
  console.log('push', event, data)

  const body = {
    endpointId: data && data.endpointId
  }
  const url = self.location.origin + '/api/actions/notifications.received'
  const f = self.fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Accept': 'application/json'
    },
    credentials: 'same-origin'
  }).then(function (result) {
    console.log('fetch result', result)
  }).catch(function (err) {
    console.error('fetch err', err)
  })

  if (data.type === 'test' || data.type === 'testBroadcast') {
    const prom = self.registration.showNotification('Willkommen Daheim Test', {
      body: 'This is a test message showing three actions and an icon.',
      icon: '/favicon-192.png',
      tag: 'test',
      actions: [{
        action: 'first',
        title: 'First Action'
      }, {
        action: 'second',
        title: 'Second Action'
      }, {
        action: 'third',
        title: 'Third Action'
      }]
    })
    event.waitUntil(Promise.all([prom, f]))
  } else if (data.type === 'studentWaiting') {
    const prom = self.registration.showNotification('Student Waiting', {
      body: 'A student is waiting for a conversation.',
      icon: '/favicon-192.png',
      tag: 'studentWaiting'
    })
    event.waitUntil(Promise.all([prom, f]))
  }
})
