import {Strategy as JwtStrategy} from 'passport-jwt'
import {User} from '../model'

export default function configureJwtStrategies ({passport, secret}) {
  /**
   * Used as a generic access token for API requests extracted from req.cookies.sid
   */
  passport.use('jwt', new JwtStrategy({
    secretOrKey: secret,
    jwtFromRequest: (req) => req.cookies.sid
  }, async function (jwt, done) {
    try {
      const user = await User.findById(jwt.sub)
      done(null, user)
    } catch (err) {
      done(err)
    }
  }))

  /**
   * Used as a password reset secret sent in emails, extracted from req.body.token
   */
  passport.use('reset', new JwtStrategy({
    secretOrKey: secret,
    jwtFromRequest: (req) => req.body.token,
    audience: 'reset'
  }, async function (jwt, done) {
    try {
      const user = await User.findById(jwt.sub)
      done(null, user || false)
    } catch (err) {
      done(err)
    }
  }))
}
