import mongoose, {Schema} from 'mongoose'

const timetable = {}
for (let day = 0; day < 7; day++) {
  for (let hour = 0; hour < 24; hour++) {
    timetable[`d${day}h${hour}`] = {
      ping: Date,
      score: Number
    }
  }
}

const activeTimeSchema = new Schema({
  timetable
})

export default mongoose.model('ActiveTime', activeTimeSchema)
