# Live System Architecture

The Daheim live system is responsible to maintain an active connection to web browsers. This connection is used to send push notifications and to keep to list of online users updated. At the heart of the architecture there is a [Socket.IO](http://socket.io/) server taking care of keeping the connections and sending and receiving messages.

## Important Limitations

As of now, there must be exactly one live server behind every Daheim cluster. This means that this service is only scalable vertically. We don't yet know the server's limits in terms of concurrent active users.

Currently the server does not persist its state. All state is kept in memory, and everything is lost in case of a restart or a version update. It is advised to proceed with server updates when there are no active connections.

## Wire Protocol

Socket.IO takes care of delivering the messages. The `data` member of the `packet` object must be an array, in which the first item is the type of the request, and the rest of the items are optional arguments.

Requests requiring a response might use Socket.IO's acknowledgement protocol. That is, when the `packet` object contains an `id` member, `socket.ack(id)(data)` might send an appropriate response to the request.

## Authentication

Users are authenticated by a [JSON Web Token](https://jwt.io/) created by the API server. The token must be passed as an `access_token` query string when the Socket.IO connection is established.

The validity of the token is checked by the [AuthHandler.middleware()](src/realtime/auth_handler.js) method that is registered an a Socket.IO middleware. Upon successful authentication, the user object is available as a member of socket, e.g. `socket.user`. As of now, the user object is never refreshed, so over time it might get out-of-sync with the database.

## Handlers

We use an object-based facility on top of the Socket.IO server. There is no need to use the raw Socket.IO socket object to receive messages. Instead the developers should attach handler objects that take care and optionally reply to incoming messages.

Handlers are registered to every incoming connection in [io.js](src/realtime/io.js) using `attachHandlers()`. Handlers can optionally have `onConnect(socket)` and `onDisconnect(socket)` methods that are invoked when the respective socket is connected or disconnected.

Handler methods start with the dollar sign (`$`) followed by the type of the request they want to react to. Optionally handler methods may return a promise that resolves to the response to the request.
