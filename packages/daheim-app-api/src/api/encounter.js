import {Router} from 'express'
import Promise from 'bluebird'
import MongooseError from 'mongoose/lib/error'

import tokenHandler from '../token_handler'
import {Encounter, User, UserRating} from '../model'

const PING_THRESHOLD = 2.5 * 60 * 1000

export class EncounterApi {

  constructor({tokenHandler}) {
    this.router = Router()
    this.router.use(tokenHandler.auth)
    this.router.get('/', this.handler(this.getEncounters))
    this.router.get('/:encounterId', this.handler(this.getEncounter))
    this.router.post('/:encounterId', this.handler(this.saveEncounter))

    this.router.use((err, req, res, next) => {
      if (err instanceof MongooseError) {
        res.status(400).send({
          error: 'validation',
          message: err.toString(),
        })
      } else {
        next(err)
      }
    })
  }

  async getEncounters({user}) {
    let encounters = await Encounter.find({'participants.userId': user.id}).sort('-date')

    let userMap = {}

    let result = encounters.map(encounter => {
      let me
      let partner

      encounter.participants.forEach(p => {
        if (p.userId === user.id) {
          me = p
        } else {
          partner = p
        }
      })

      let now = Date.now()
      let length = encounter.length
      if (!length && encounter.ping < now - PING_THRESHOLD) {
        length = encounter.ping - encounter.date
      }

      userMap[partner.userId] = false

      return {
        id: encounter.id,
        date: encounter.date.getTime(),
        length,
        myReview: me.review,
        partnerReview: partner.review,
        partnerId: partner.userId,
      }
    })

    let users = await User.find({_id: {$in: Object.keys(userMap)}}).select('profile.name')
    for (let user of users) {
      userMap[user.id] = user.profile.name
    }
    for (let encounter of result) {
      encounter.partnerName = userMap[encounter.partnerId]
    }

    return result
  }

  async getEncounter({user, params: {encounterId}}) {
    let encounter = await Encounter.findOne({
      _id: encounterId,
      'participants.userId': user.id,
    })
    if (!encounter) { throw new Error('not found') }

    let me
    let partner
    encounter.participants.forEach(p => {
      if (p.userId === user.id) {
        me = p
      } else {
        partner = p
      }
    })

    let [myRating, partnerRating] = await Promise.all([
      UserRating.findOne({from: me.userId, userId: partner.userId}).select('overall language -_id'),
      UserRating.findOne({from: partner.userId, userId: me.userId}).select('overall language -_id'),
    ])

    let now = Date.now()
    let length = encounter.length
    if (!length && encounter.ping < now - PING_THRESHOLD) {
      length = encounter.ping - encounter.date
    }

    let partnerUser = await User.findById(partner.userId).select('profile.name')
    return {
      id: encounter.id,
      date: encounter.date.getTime(),
      length,
      myReview: me.review,
      partnerReview: partner.review,
      partnerId: partner.userId,
      partnerName: partnerUser ? partnerUser.profile.name : undefined,
      myRating,
      partnerRating,
    }
  }

  async saveEncounter({user, body, params: {encounterId}}) {
    let encounter = await Encounter.findOne({
      _id: encounterId,
      'participants.userId': user.id,
    })
    if (!encounter) { throw new Error('not found') }

    let me
    let partner
    encounter.participants.forEach(p => {
      if (p.userId === user.id) {
        me = p
      } else {
        partner = p
      }
    })

    if (body.myRating) {
      let userRating = await UserRating.findOne({from: me.userId, userId: partner.userId})
      if (!userRating) { userRating = new UserRating({from: me.userId, userId: partner.userId}) }
      userRating.overall = body.myRating.overall
      userRating.language = body.myRating.language
      await userRating.save()
    }

    if (body.myReview) {
      let {overall, words, good, bad} = body.myReview
      me.review = {overall, words, good, bad}
      await encounter.save()
    }

    return await this.getEncounter({user, params: {encounterId}})
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

export default new EncounterApi({tokenHandler})
