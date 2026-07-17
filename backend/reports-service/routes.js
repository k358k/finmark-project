const express = require('express')
const Report = require('./models/Report')
const router = express.Router()

router.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

router.get('/summary', async (req, res) => {
  try {
    const records = await Report.find()

    let totalRevenue = 0
    let totalItemsSold = 0

    for (const record of records) {
      if (!record.totalRevenue || !record.totalItemsSold) {
        console.log('[System Notice] Corrupted record skipped safely')
        continue
      }
      totalRevenue += record.totalRevenue
      totalItemsSold += record.totalItemsSold
    }

    let note = undefined
    if (totalRevenue === 0 && totalItemsSold === 0) {
      note = 'No valid records found in dataset'
    }

    res.json({
      metrics: {
        totalRevenue: totalRevenue,
        totalItemsSold: totalItemsSold
      },
      ...(note && { note })
    })

  } catch (error) {
    console.error('[reports-service] Error:', error.message)
    res.status(500).json({
      status: 'Error',
      message: 'Internal Server Exception: Data pipeline interrupted gracefully.'
    })
  }
})

module.exports = router
