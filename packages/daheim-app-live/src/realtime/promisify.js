import Namespace from 'socket.io/lib/namespace'
import Promise from 'bluebird'

Promise.promisifyAll(Namespace.prototype)
