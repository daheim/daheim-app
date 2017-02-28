import {Router} from 'express'
import Bluebird from 'bluebird'
import passport from 'passport'
import uuid from 'node-uuid'
import axios from 'axios'
import crypto from 'crypto'

import restError from '../restError'
import sendgrid from '../sendgrid'
import tokenHandler from '../token_handler'
import {avatars} from 'daheim-app-model'
import mailchimp from '../mailchimp'
import slack from '../slack'
import intl from '../intl'
import log from '../log'

import {User, Review, Lesson} from '../model'

import registerHelpdesk from './helpdesk'
import registerNotifications from './notifications'

const app = new Router()

function def (action, cb, {auth = true, middlewares = []} = {}) {
  const handler = async (req, res, next) => {
    try {
      const result = await cb(req, res)
      res.send(result)
    } catch (err) {
      next(err)
    }
  }

  const handlers = [
    ...(auth ? [tokenHandler.auth] : []),
    ...middlewares,
    handler
  ]

  app.post(action, handlers)
}

registerHelpdesk(def)
registerNotifications(def)

def('/auth.login', async (req, res, next) => {
  const {user, info} = await new Promise((resolve, reject) => {
    passport.authenticate('local', {session: false}, (err, user, info) => {
      if (err) return reject(err)
      resolve({user, info})
    })(req, res, next)
  })
  req.user = user

  if (!user) {
    res.status(401)
    return info || {}
  }

  slack.sendText(`${req.user.username} logged in`)

  const accessToken = tokenHandler.issueForUser(req.user.id)
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
  res.cookie('sid', accessToken, {httpOnly: true, secure: process.env.SECURE_COOKIES === '1', expires})
  res.cookie('_csrf', uuid.v4(), {secure: process.env.SECURE_COOKIES === '1', expires})
  return {profile: req.user}
}, {
  auth: false,
  checkCsrf: false
})

def('/auth.facebookLogin', async (req, res) => {
  const {facebookAccessToken} = req.body

  let facebookResponse
  try {
    // email is verified: https://stackoverflow.com/questions/14280535/is-it-possible-to-check-if-an-email-is-confirmed-on-facebook
    facebookResponse = await axios.get(`https://graph.facebook.com/v2.7/me?fields=id,email,first_name&access_token=${encodeURIComponent(facebookAccessToken)}`)
  } catch (err) {
    log.error({err, facebookAccessToken}, 'facebook login error')
    throw restError({code: 'facebookAuthError', error: 'Please try again later'})
  }

  const {email} = facebookResponse.data
  const firstName = facebookResponse.data.first_name
  if (!email) throw restError({code: 'facebookNeedsEmail', error: 'Your Facebook account does not have a verified email address'})

  let result = 'login'
  const username = email

  let user = await User.findOne({username})
  if (!user) {
    mailchimp.addMemberIfNew({email, firstName})
    user = new User({
      username,
      password: crypto.randomBytes(20).toString('base64'),
      profile: {
        name: firstName
      }
    })
    await user.save()
    result = 'register'
  }

  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
  const accessToken = tokenHandler.issueForUser(user.id)
  res.cookie('sid', accessToken, {httpOnly: true, secure: process.env.SECURE_COOKIES === '1', expires})
  return {result}
}, {
  auth: false,
  checkCsrf: false
})

def('/auth.register', async (req, res) => {
  const {username, password, newsletter, firstName} = req.body

  try {
    let user = await User.getAuthenticated(username, password)

    if (newsletter) mailchimp.addMemberIfNew({email: username, firstName})
    slack.sendText(`${user.username} logged in`)

    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
    const accessToken = tokenHandler.issueForUser(user.id)
    res.cookie('sid', accessToken, {httpOnly: true, secure: process.env.SECURE_COOKIES === '1', expires})
    return {result: 'login'}
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
    username,
    password,
    profile: {
      name: firstName
    }
  })
  await user.save()

  if (newsletter) mailchimp.addMemberIfNew({email: username, firstName})
  slack.sendText(`${user.username} registered`)

  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
  const accessToken = tokenHandler.issueForUser(user.id)
  res.cookie('sid', accessToken, {httpOnly: true, secure: process.env.SECURE_COOKIES === '1', expires})
  return {result: 'new'}
}, {
  auth: false,
  checkCsrf: false
})

def('/auth.logout', async (req, res) => {
  res.clearCookie('sid')
  return {}
}, {
  auth: false,
  checkCsrf: true
})

def('/auth.requestNewPassword', async (req, res) => {
  const {username} = req.body

  const user = await User.findOne({username})
  if (!user) throw restError({code: 'user_not_found', error: 'Invalid username'})

  let token = tokenHandler.issuePasswordResetToken(user.id)
  let address = user.username
  await sendgrid.send({
    to: address,
    subject: intl.formatMessage('forgotPassword.email.subject'),
    html: intl.formatMessage('forgotPassword.email.text', {
      linkStart: `<a href="${process.env.URL}/auth/reset?token=${encodeURIComponent(token)}">`,
      linkEnd: '</a>'
    }).replace(/\n/g, '<br/>')
  })
  return {}
}, {
  auth: false,
  checkCsrf: false
})

def('/auth.resetPassword', async (req, res) => {
  const {user} = req
  const {password} = req.body

  user.password = password
  user.loginAttempts = 0
  user.lockUntil = null
  await user.save()

  const accessToken = tokenHandler.issueForUser(req.user.id)
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
  res.cookie('sid', accessToken, {httpOnly: true, secure: process.env.SECURE_COOKIES === '1', expires})
  res.cookie('_csrf', uuid.v4(), {secure: process.env.SECURE_COOKIES === '1', expires})
  return {profile: req.user}
}, {
  auth: false,
  middlewares: [passport.authenticate('reset', {session: false})],
  checkCsrf: false
})

def('/auth.changePassword', async (req, res) => {
  const {newPassword, email} = req.body
  req.user.username = email
  if (newPassword) req.user.password = newPassword
  req.user.save()
  return {}
}, {
  auth: false,
  middlewares: [
    // always reauthenticate
    passport.authenticate('local', {session: false})
  ]
})

def('/auth.closeAccount', async (req, res) => {
  const {user} = req
  await user.remove()
  await Review.remove({to: user.id})
  return {}
})

def('/profile.saveProfile', async (req) => {
  const {user, body} = req
  const {name, gender, topics, languages, inGermanySince, germanLevel, introduction, pictureType, pictureData} = body

  const rollback = []
  const commit = []

  user.profile.completed = true
  if (name != null) user.profile.name = name
  if (gender != null) user.profile.gender = gender
  if (inGermanySince != null) user.profile.inGermanySince = inGermanySince
  if (germanLevel != null) user.profile.germanLevel = germanLevel
  if (introduction != null) user.profile.introduction = introduction

  if (languages) {
    for (let x = 0; x < user.profile.languages2.length; x++) {
      const language = user.profile.languages2[x]
      if (languages[language] !== undefined && !languages[language]) {
        user.profile.languages2.splice(x, 1)
        x--
      }
    }

    for (let x in languages) {
      if (languages[x]) user.profile.languages2.push(x)
    }
  }

  if (topics) {
    for (let x = 0; x < user.profile.topics2.length; x++) {
      const topic = user.profile.topics2[x]
      if (topics[topic] !== undefined && !topics[topic]) {
        user.profile.topics2.splice(x, 1)
        x--
      }
    }

    for (let x in topics) {
      if (topics[x]) user.profile.topics2.push(x)
    }
  }

  if (pictureType) {
    // delete old file in commit hook
    if (user.pictureType === 'file') {
      commit.push(deleteFileHook(user.profile.pictureData))
    }

    if (pictureType === 'gravatar') {
      user.profile.pictureType = 'gravatar'
      user.profile.pictureData = undefined
    } else if (pictureType === 'avatar') {
      if (!avatars[pictureData]) throw new Error('invalid avatar')
      user.profile.pictureType = 'avatar'
      user.profile.pictureData = pictureData
    } else if (pictureType === 'data') {
      // TODO: upload picture
      user.profile.pictureType = 'data'
      user.profile.pictureData = pictureData
      // user.pictureData
      // rollback.push(deleteFileHook(user.profile.pictureData))
    } else {
      throw new Error('invalid picture type')
    }
  }

  try {
    await user.save()
  } catch (err) {
    rollback.map((hook) => hook())
  }

  commit.map((hook) => hook())
  return {user}
})

async function loadUser (id, asUserId) {
  const user = await User.findById(id)
  if (!user) throw restError({code: 'user_not_found', error: 'User not found'})

  const [receivedReviews, myReview] = await Bluebird.all([
    Review.find({to: id}),
    Review.findOne({to: id, from: asUserId})
  ])

  const raw = {
    ...user.toJSON().profile,
    id: user.id,
    myReview,
    receivedReviews
  }

  return {
    users: {
      [raw.id]: raw
    }
  }
}

def('/users.loadUser', async (req) => {
  const {id} = req.body
  return loadUser(id, req.user.id)
})

def('/lessons.loadLessons', async (req) => {
  const raw = await Lesson.find({participants: req.user.id})
    .limit(20).sort({createdTime: -1}).exec()

  const lessonList = []
  const lessons = {}
  for (let lesson of raw) {
    lessonList.push(lesson.id)
    lessons[lesson.id] = lesson
  }

  return {lessonList, lessons}
})

def('/users.sendReview', async (req) => {
  const {user, body} = req

  const {to, rating, text} = body
  const date = new Date()
  // TODO: compare from and to case insensitive
  // TODO: load user
  // TODO: check if had lesson

  await Review.update({from: user.id, to}, {$set: {date, rating, text}}, {runValidators: true, upsert: true})

  return loadUser(to, req.user.id)
})

const deleteFileHook = (path) => async () => {
  // TODO: delete azure file
}

export default app
