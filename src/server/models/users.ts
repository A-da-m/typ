import mongoose from 'mongoose'

const favorites: mongoose.Schema = new mongoose.Schema({
  id: String,
  botID: String,
  date: String
})

const collections: mongoose.Schema = new mongoose.Schema({
  id: String,
  name: String,
  date: String,
  bots: [favorites]
})

const schema: mongoose.Schema = new mongoose.Schema({
  id: String,
  username: String,
  discriminator: String,
  avatar: String,
  favorites: [favorites],
  collections: [collections],
  certified: Boolean
})

export default mongoose.model('users', schema)
