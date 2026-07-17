const express = require('express')
const Order = require('./models/Order')
const router = express.Router()

router.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

router.post('/', async (req, res) => {
  try {
    const { customerName, quantity, orderValue } = req.body

    if (!customerName || !quantity || !orderValue) {
      return res.status(400).json({
        message: 'All fields are required - customerName, quantity, orderValue'
      })
    }

    if (!/^[a-zA-Z0-9\s'\-]{2,}$/.test(customerName)) {
      return res.status(400).json({ message: 'Customer name must be at least 2 characters and contain only letters, numbers, spaces, hyphens, or apostrophes' })
    }

    const orderId = 'FM-ORD-' + Date.now()
    await Order.create({ customerName, quantity, orderValue, orderId })

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: orderId
    })
  } catch (error) {
    console.error('[orders-service] Error:', error.message)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router
