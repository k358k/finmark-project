const express = require('express')
const cors = require('cors')
const routes = require('./routes')

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/products', routes)

const ACTIVE_PORT = 3003
const STANDBY_PORT = 3013

app.listen(ACTIVE_PORT, () => {
  console.log(`[products-service] Active instance running on port ${ACTIVE_PORT}`)
})

app.listen(STANDBY_PORT, () => {
  console.log(`[products-service] Standby instance running on port ${STANDBY_PORT}`)
})
