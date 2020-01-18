import mongoose from 'mongoose'

const schema: mongoose.Schema = new mongoose.Schema({
  id: String,
  ownerID: String,
  username: String,
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
  invite: String
})

export default mongoose.model('bots', schema)
