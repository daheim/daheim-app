console.log('start', self)

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
      if ('focus' in client) {
        return client.focus()
      }
    }
    if ('openWindow' in self.clients) {
      return self.clients.openWindow('https://app.daheimapp.de')
    }
  })
  event.waitUntil(prom)
})

self.addEventListener('push', function (event) {
  const data = event.data ? event.data.json() : {}
  console.log('push', event, data)

  if (data.type === 'test') {
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
  }
})
