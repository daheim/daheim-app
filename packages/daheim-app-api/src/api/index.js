import {Router} from 'express'
import passport from 'passport'
import uuid from 'node-uuid'

import sendgrid from '../sendgrid'
import {User} from '../model'
import tokenHandler from '../token_handler'
import encounterApi from './encounter'

export class Api {

  constructor() {
    this.router = Router()
    this.router.get('/healthz', (req, res) => res.send('ok'))

    this.router.post('/register', this.handler(this.register))
    this.router.post('/login', passport.authenticate('local', {session: false}), this.handler(this.login))
    this.router.post('/forgot', this.handler(this.forgot))
    this.router.post('/reset', passport.authenticate('reset', {session: false}), this.handler(this.reset))

    this.router.post('/realtimeToken', tokenHandler.auth, this.handler(this.realtimeToken))
    this.router.post('/role', tokenHandler.auth, this.handler(this.postRole))
    this.router.get('/profile', tokenHandler.auth, this.handler(this.getProfile))

    this.router.use('/encounters', encounterApi.router)

    this.router.get('*', (req, res) => res.status(404).send({error: 'not_found'}))
  }

  async getProfile (req, res) {
    return await User.findById(req.user.id)
  }

  realtimeToken (req, res) {
    res.send({token: tokenHandler.issueRealtimeToken(req.user.id)})
  }

  async postRole (req, res, next) {
    try {
      const {role} = req.body
      const user = await User.findById(req.user.id)
      user.profile.role = role
      await user.save()
      res.send(user)
    } catch (err) {
      next(err)
    }
  }

  async register({body: {email, password}}, res) {
    try {
      let user = await User.getAuthenticated(email, password)
      return {
        result: 'login',
        accessToken: tokenHandler.issueForUser(user.id),
      }
    } catch (err) {
      if (err.name !== 'AuthError') {
        throw err
      }

      if (err.message !== 'user not found') {
        res.status(400).send({error: 'user_already_exists'})
        return
      }
    }

    // TODO: save newsletter information
    let user = new User({
      username: email,
      password,
    })
    await user.save()
    return {
      result: 'new',
      accessToken: tokenHandler.issueForUser(user.id),
    }
  }

  async login(req, res) {
    const accessToken = tokenHandler.issueForUser(req.user.id)
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
    res.cookie('sid', accessToken, {httpOnly: true, secure: process.env.SECURE_COOKIES === '1', expires})
    res.cookie('_csrf', uuid.v4(), {secure: process.env.SECURE_COOKIES === '1', expires})
    return {profile: req.user}
  }

  async forgot({body: {email}}, res) {
    let user = await User.findOne({username: email})
    if (!user) {
      res.status(400).send({error: 'user_not_found'})
      return
    }

    let token = tokenHandler.issuePasswordResetToken(user.id)
    let address = user.username
    let sg = new sendgrid.Email({
      to: address,
      from: 'daheim@mesellyounot.com',
      fromname: 'Daheim',
      subject: 'Daheim Password Reset',
      html: `Please click <a href="${process.env.URL}/auth/reset?token=${encodeURIComponent(token)}">here reset your password.</a>.`,
    })
    await sendgrid.sendAsync(sg)
  }

  async reset({body: {password}, user}) {
    user.password = password
    user.loginAttempts = 0
    user.lockUntil = null
    await user.save()

    return {
      accessToken: tokenHandler.issueForUser(user.id),
    }
  }

  handler(fn) {
    let self = this
    return async function(reqIgnored, res, next) {
      try {
        let result = await fn.apply(self, arguments)
        res.send(result)
      } catch (err) {
        next(err)
      }
    }
  }

}

export default new Api()
