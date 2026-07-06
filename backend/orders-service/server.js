const express = require('express')
const cors = require('cors')
const routes = require('./routes')

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/orders', routes)

const PORT = process.env.PORT
if (!PORT) {
  console.error('PORT environment variable is required')
  process.exit(1)
}

app.listen(PORT, () => {
  console.log(`[orders-service] Instance running on port ${PORT}`)
})
