const mongoose = require('mongoose')

const connectDB = async () => {
  const uri = process.env.MONGO_URI
  if (!uri) {
    console.error('MONGO_URI environment variable is required')
    process.exit(1)
  }
  await mongoose.connect(uri)
  console.log('[MongoDB] Connected successfully')
}

module.exports = connectDB
