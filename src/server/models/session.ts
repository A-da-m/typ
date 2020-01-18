import mongoose from 'mongoose'

const schema: mongoose.Schema = new mongoose.Schema({
  _id: String,
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  expires: {
    type: Date,
    expires: 6.048e+8
  }
}, {
  versionKey: false
})

export default mongoose.model('sessions', schema)
