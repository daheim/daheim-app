import mongoose, {Schema} from 'mongoose'

let EncounterSchema = new Schema({
  date: {type: Date, required: true},
  length: Number,
  ping: {type: Date, required: true},
  participants: [{
    userId: {type: String, required: true, index: true},
    review: Object,
    _id: false
  }],
  result: String
})

let Encounter = mongoose.model('Encounter', EncounterSchema)
export {Encounter}

let UserRatingSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, required: true},
  from: {type: Schema.Types.ObjectId, required: true},
  overall: {type: Number, min: 1, max: 5, required: true},
  language: {type: Number, min: 1, max: 5}
})

UserRatingSchema.index({userId: 1, from: 1}, {unique: true})

export let UserRating = mongoose.model('UserRating', UserRatingSchema)
