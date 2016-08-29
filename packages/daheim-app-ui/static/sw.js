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
    if (self.clients.openWindow) return self.clients.openWindow(location.origin)
  })
  event.waitUntil(prom)
})

self.addEventListener('push', function (event) {
  const data = event.data ? event.data.json() : {}
  console.log('push', event, data)

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
    event.waitUntil(prom)
  } else if (data.type === 'studentWaiting') {
    const prom = self.registration.showNotification('Student Waiting', {
      body: 'A student is waiting for a conversation.',
      icon: '/favicon-192.png',
      tag: 'studentWaiting',
    })
    event.waitUntil(prom)
  }
})
