import {Schema, default as mongoose} from 'mongoose'
import bcrypt from 'bcryptjs'
import BaseError from 'es6-error'
import gravatar from 'gravatar'
import Bluebird from 'bluebird'

import avatars from '../avatars'

Bluebird.promisifyAll(bcrypt)

const SALT_WORK_FACTOR = 10
const MAX_LOGIN_ATTEMPTS = 10
const LOCK_TIME = 3 * 60 * 1000

export class AuthError extends BaseError {
  constructor (m, info) {
    super(m)
    this.info = info
  }
}

function aToO (a) {
  const o = {}
  for (let value of a || []) {
    o[value] = 1
  }
  return o
}

let UserSchema = new Schema({
  username: {type: String, required: true, index: {unique: true}},
  password: {type: String, required: true},

  loginAttempts: {type: Number, required: true, default: 0},
  lockUntil: {type: Date},

  profile: {
    completed: Boolean,
    name: String,
    role: String,
    gender: String,
    languages2: [String],
    topics2: [String],
    inGermanySince: String,
    germanLevel: Number,
    introduction: String,
    pictureType: String,
    pictureData: String
  },

  notifications: {
    enabled: Boolean,
    endpoints: [{
      id: String,
      endpoint: String,
      userPublicKey: String,
      userAuth: String,
      userAgent: String
    }]
  }
}, {
  toJSON: {
    transform (doc, ret, options) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v

      ret.profile.userSince = doc._id.getTimestamp()

      ret.profile.languages = aToO(ret.profile.languages2)
      delete ret.profile.languages2
      ret.profile.topics = aToO(ret.profile.topics2)
      delete ret.profile.topics2

      if (ret.profile.pictureType === 'avatar') {
        ret.profile.picture = avatars[ret.profile.pictureData] || avatars.default
      } else if (ret.profile.pictureType === 'data') {
        ret.profile.picture = ret.profile.pictureData
      } else {
        ret.profile.picture = gravatar.url(ret.username, {s: '256', r: 'x', d: 'monsterid', protocol: 'https'})
      }
      delete ret.profile.pictureType
      delete ret.profile.pictureData

      ret.notifications.endpoints = ret.notifications.endpoints.map(({id, userAgent}) => {
        return {id, userAgent}
      })

      delete ret.password
      delete ret.loginAttempts

      return ret
    }
  }
})

UserSchema.pre('save', function (next) {
  const LEVELS = {
    none: 1,
    beginner: 1,
    intermediate: 1,
    advanced: 1,
    native: 1
  }

  if (!this.isModified('profile')) {
    return next()
  }

  let {name, languages, topics} = this.profile

  let error
  try {
    if (this.isModified('profile.name') && name !== undefined) {
      if (name.length < 2 || name.length > 128) { throw new Error('name length must be between 2 and 128') }
    }
    if (this.isModified('profile.languages') && languages.length > 0) {
      if (languages.length < 2 || languages.length > 10) { throw new Error('number of language must be between 2 and 10') }
      languages.forEach(({language, level}) => {
        if (language.length < 2 || language.length > 128) { throw new Error('length of language must be between 2 and 128') }
        if (!LEVELS[level]) { throw new Error('invalid level') }
        return {language, level}
      })
    }
    if (this.isModified('profile.topics') && topics.length > 0) {
      if (topics.length > 20) { throw new Error('number of topics must be at most 20') }
    }
  } catch (err) {
    error = err
  } finally {
    next(error)
  }
})

UserSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

UserSchema.pre('save', async function(next) {
  let error
  try {
    if (!this.isModified('password')) { return }
    let salt = await bcrypt.genSaltAsync(SALT_WORK_FACTOR)
    this.password = await bcrypt.hashAsync(this.password, salt)
  } catch (err) {
    error = err
  } finally {
    next(error)
  }
})

UserSchema.pre('save', async function(next) {
  let error
  try {
    if (!this.isModified('username')) { return }
    this.username = this.username.toLowerCase()
  } catch (err) {
    error = err
  } finally {
    next(error)
  }
})

UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compareAsync(candidatePassword, this.password)
}

UserSchema.methods.incLoginAttempts = function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.update({
      $set: {loginAttempts: 1},
      $unset: {lockUntil: 1}
    })
  }

  let updates = {$inc: {loginAttempts: 1}}
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    updates.$set = {lockUntil: new Date(Date.now() + LOCK_TIME)}
  }
  return this.update(updates)
}

UserSchema.statics.getAuthenticated = async function(username, password) {
  username = username.toLowerCase()
  let user = await this.findOne({username})
  if (!user) { throw new AuthError('user not found', {userNotFound: true}) }

  if (user.isLocked) {
    await user.incLoginAttempts()
    throw new AuthError('account locked', {accountLocked: true, lockUntil: user.lockUntil})
  }

  if (!await user.comparePassword(password)) {
    await user.incLoginAttempts()
    throw new AuthError('invalid password', {invalidPassword: true})
  }

  if (user.loginAttempts || user.lockUntil) {
    await user.update({
      $set: {loginAttempts: 0},
      $unset: {lockUntil: 1}
    })
  }

  return user
}

let User = mongoose.model('User', UserSchema)
export {User}

