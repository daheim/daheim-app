import express from 'express'
import Promise from 'bluebird'

import createSendgrid from 'sendgrid'
var sendgrid = createSendgrid(process.env.SENDGRID_KEY)

import createDebug from 'debug'
let debug = createDebug('dhm:user')

Promise.promisifyAll(sendgrid)

const $postRegister = Symbol('postRegister')
const $postProfile = Symbol('postProfile')
const $postLoginLink = Symbol('postLoginLink')
const $postLogin = Symbol('postLogin')
const $getProfile = Symbol('getProfile')
const $postProfilePicture = Symbol('postProfilePicture')

const $router = Symbol('router')
const $userStore = Symbol('userStore')
const $tokenHandler = Symbol('tokenHandler')

export default class User {

  constructor({userStore, tokenHandler}) {
    this[$userStore] = userStore
    this[$tokenHandler] = tokenHandler
    this.tokenHandler = tokenHandler

    let router = this[$router] = express.Router()

    router.post('/register', bind(this, this[$postRegister]))
    router.post('/loginLink', bind(this, this[$postLoginLink]))
    router.post('/login', bind(this, this[$postLogin]))
    router.post('/profile', tokenHandler.auth, bind(this, this[$postProfile]))
    router.post('/profile/picture', tokenHandler.auth, bind(this, this[$postProfilePicture]))
    router.get('/profile', tokenHandler.auth, bind(this, this[$getProfile]))
  }

  get router() { return this[$router] }

  async [$postRegister](req, res, next) {
    try {
      let user = await this[$userStore].loadUserWithEmail(req.body.email)
      if (user) {
        return res.send({state: 'registered', hasPassword: false})
      }

      let id = await this[$userStore].createUserWithEmail(req.body.email)
      return res.send({state: 'new', accessToken: this[$tokenHandler].issueForUser(id)})
    } catch (err) {
      next(err)
    }
  }

  async [$getProfile](req, res, next) {
    try {
      res.send(await this[$userStore].getProfile(req.user.id))
    } catch (err) {
      next(err)
    }
  }

  async [$postProfile](req, res, next) {
    try {
      try {
        res.send(await this[$userStore].updateProfile(req.user.id, req.body))
      } catch (err) {
        res.status(400).send(err.message)
      }
    } catch (err) {
      next(err)
    }
  }

  async [$postLoginLink](req, res, next) {
    try {
      let user = await this[$userStore].loadUserWithEmail(req.body.email)
      if (!user) {
        return res.status(400).send({error: 'UserNotFound'})
      }
      let token = this[$tokenHandler].issueLoginToken(user.PartitionKey._)
      debug('token', token)

      let address = JSON.parse(user.Data._).email
      let email = new sendgrid.Email({
        to: address,
        from: 'daheim@mesellyounot.com',
        fromname: 'Daheim',
        subject: 'Daheim Login',
        html: `Please click <a href="${process.env.URL}/#!/login/token/${token}">here to log in</a>.`,
      })
      await sendgrid.sendAsync(email)

      res.send({})
    } catch (err) {
      next(err)
    }
  }

  async [$postLogin](req, res, next) {
    try {
      if (req.body.token) {
        let accessToken = this[$tokenHandler].issueForLoginToken(req.body.token)
        res.send({accessToken})
      } else {
        throw new Error('invalid login method')
      }
    } catch (err) {
      next(err)
    }
  }

  async [$postProfilePicture](req, res, next) {
    try {
      const header = 'data:image/pngbase64,'
      if (typeof req.body.data !== 'string') { throw new Error('data must be defined') }
      if (req.body.data.substring(0, header.length) !== header) { throw new Error('only base64 image/png data urls are supported') }
      let buffer = new Buffer(req.body.data.substring(header.length), 'base64')
      let rIgnored = await this[$userStore].uploadProfilePicture(req.user.id, buffer)
      res.send({})
    } catch (err) {
      next(err)
    }
  }

}

function bind(self, fn) {
  return function() {
    fn.apply(self, arguments)
  }
}
