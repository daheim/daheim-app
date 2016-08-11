import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt'
import jwt from 'jsonwebtoken'
import passport from 'passport'

import createDebug from 'debug'
let debug = createDebug('dhm:token') // eslint-disable-line no-unused-vars

import {User} from './model'

const SECRETS = new WeakMap()
const $passport = Symbol('passport')

export class TokenHandler {

  constructor ({secret, passport}) {
    if (!secret) { throw new Error('secret must be defined') }
    SECRETS[this] = secret

    if (passport) {
      this[$passport] = passport
      passport.use('jwt', new JwtStrategy({
        secretOrKey: SECRETS[this],
        jwtFromRequest: (req) => req.cookies.sid
      }, async function (jwt, done) {
        try {
          let user = await User.findById(jwt.sub)
          done(null, user)
        } catch (err) {
          done(err)
        }
      }))

      passport.use('reset', new JwtStrategy({
        secretOrKey: SECRETS[this],
        jwtFromRequest: (req) => req.body.token,
        audience: 'reset',
      }, async function (jwt, done) {
        try {
          let user = await User.findById(jwt.sub)
          done(null, user || false)
        } catch (err) {
          done(err)
        }
      }))
    }
  }

  get auth () { return this[$passport].authenticate('jwt', {session: false}) }

  issueForUser (userId) {
    return jwt.sign({}, SECRETS[this], {subject: userId, audience: 'access'})
  }

  issueForLoginToken (loginToken) {
    let decoded = jwt.verify(loginToken, SECRETS[this], {audience: 'login', maxAge: '15m'})
    return this.issueForUser(decoded.sub)
  }

  issueLoginToken (userId) {
    return jwt.sign({}, SECRETS[this], {subject: userId, audience: 'login', expiresIn: '15m'})
  }

  issuePasswordResetToken (userId) {
    return jwt.sign({}, SECRETS[this], {subject: userId, audience: 'reset', expiresIn: '15m'})
  }

  verifyAccessToken (accessToken) {
    let decoded = jwt.verify(accessToken, SECRETS[this], {audience: 'access'})
    return decoded.sub
  }

  issueRealtimeToken (userId) {
    return jwt.sign({}, SECRETS[this], {subject: userId, audience: 'realtime', expiresIn: '5m'})
  }

  verifyRealtimeToken (accessToken) {
    let decoded = jwt.verify(accessToken, SECRETS[this], {audience: 'realtime', maxAge: '5m'})
    return decoded.sub
  }
}

export default new TokenHandler({passport, secret: process.env.SECRET})
