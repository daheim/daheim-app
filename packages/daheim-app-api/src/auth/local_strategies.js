import LocalStrategy from 'passport-local'
import {User} from '../model'

export default function configureLocalStrategies ({passport, secret}) {

  passport.use('local', new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.getAuthenticated(username, password)
      done(null, user)
    } catch (err) {
      if (err.name === 'AuthError') return done(null, null)
      return done(err)
    }
  }))


}