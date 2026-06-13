const express = require('express')
const cors = require('cors')

// Pulling in each route file - each one owns it own logic
const authRoutes = require('./routes/auth')
const orderRoutes = require('./routes/orders')
const productRoutes = require('./routes/products')
const reportRoutes = require('./routes/reports')

const app = express()

app.use(cors())
app.use(express.json())

// Mount each route at its base path
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/products', productRoutes)
app.use('/api/reports', reportRoutes)

const PORT = 3001

// Starts the server - everything above this is just config until this line runs
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})