import mongoose, {Schema} from 'mongoose'

const reviewSchema = new Schema({
  from: {type: String, required: true},
  to: {type: String, required: true, index: true},
  date: {type: Date, required: true},
  rating: {type: Number, required: true},
  text: String
}, {
  toJSON: {
    transform: function(doc, ret, options) {
      // ret.id = ret._id
      delete ret._id
      delete ret.__v

      return ret
    }
  }
})

reviewSchema.index({from: 1, to: 1}, {unique: true})

export default mongoose.model('Review', reviewSchema)
