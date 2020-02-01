import mongoose from 'mongoose'

const schema: mongoose.Schema = new mongoose.Schema({
  id: String,
  ownerID: String,
  username: { type: String, text: true },
  discriminator: String,
  avatar: String,
  tags: [String],
  description: {
    short: String,
    long: String
  },
  banner: String,
  featured: Number,
  certified: Boolean,
  public: Boolean,
  approved: Boolean,
  invite: String,
  date: Date
})

schema.path('username').index({ text: true })

export default mongoose.model('bots', schema)
