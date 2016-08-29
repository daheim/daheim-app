import mongoose, {Schema} from 'mongoose'

const lessonSchema = new Schema({

  createdTime: Date,
  pingTime: Date,
  closeTime: Date,
  participants: [{type: Schema.Types.ObjectId, ref: 'User', index: true}]

}, {
  toJSON: {
    transform (doc, ret, options) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v

      const now = new Date()
      const closed = doc.closeTime || (now - doc.pingTime > 2 * 60 * 1000)
      const closeTime = closed ? doc.closeTime || doc.pingTime : now
      ret.active = !closed
      ret.duration = closeTime - doc.createdTime

      delete ret.pingTime
      delete ret.closeTime

      return ret
    }
  }
})

export default mongoose.model('Lesson', lessonSchema)
