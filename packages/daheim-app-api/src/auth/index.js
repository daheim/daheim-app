import passport from 'passport'

import configureJwtStrategies from './jwt_strategies'
import configureLocalStrategies from './local_strategies'

export default function configurePassport ({secret}) {
  configureJwtStrategies({passport, secret})
  configureLocalStrategies({passport, secret})
}
