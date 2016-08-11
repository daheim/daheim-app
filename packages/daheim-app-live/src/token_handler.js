import jwt from 'jsonwebtoken'

import createDebug from 'debug'
let debug = createDebug('dhm:token') // eslint-disable-line no-unused-vars

import {User} from './model'

const SECRETS = new WeakMap()
const $passport = Symbol('passport')

export class TokenHandler {

  constructor ({secret, passport}) {
    if (!secret) { throw new Error('secret must be defined') }
    SECRETS[this] = secret
  }

  issueRealtimeToken (userId) {
    return jwt.sign({}, SECRETS[this], {subject: userId, audience: 'realtime', expiresIn: '5m'})
  }

  verifyRealtimeToken (accessToken) {
    let decoded = jwt.verify(accessToken, SECRETS[this], {audience: 'realtime', maxAge: '5m'})
    return decoded.sub
  }
}

export default new TokenHandler({secret: process.env.SECRET})
