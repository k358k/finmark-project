const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const connectDB = require('./shared/db')

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/orders', routes)

const PORT = Number(process.env.PORT)
const STANDBY_PORT = 3012
if (!PORT) {
  console.error('PORT environment variable is required')
  process.exit(1)
}

connectDB().then(() => {
  app.listen(PORT, () => {
    if (PORT === STANDBY_PORT) {
      console.log(`[orders-service] ⚡ STANDBY instance now serving on port ${PORT}`)
    } else {
      console.log(`[orders-service] ✅ ACTIVE instance running on port ${PORT}`)
    }
  })
}).catch((err) => {
  console.error('[orders-service] Failed to connect to MongoDB:', err.message)
  process.exit(1)
})
