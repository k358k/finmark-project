const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
  const { customerName, quantity, orderValue } = req.body

  // if any field is missing, reject the request early
  if (!customerName || !quantity || !orderValue) {
    return res.status(400).json({
      message: 'All fields are required - customerName, quantity, orderValue'
    })
  }

  // all fields present - return a mock order ID
  res.status(201).json({
    message: 'Order placed successfully',
    orderId: 'FM-ORD-' + Date.now()
  })
})

module.exports = router
