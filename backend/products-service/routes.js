const express = require('express')
const Redis = require('ioredis')
const Product = require('./models/Product')
const router = express.Router()

const redis = new Redis(process.env.REDIS_URL)
const CACHE_TTL = 60
const CACHE_KEY = 'products:all'

router.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

router.get('/', async (req, res) => {
  try {
    let cached = null
    try {
      cached = await redis.get(CACHE_KEY)
    } catch (redisErr) {
      console.log('[Redis] Cache unavailable - falling back to MongoDB')
    }

    if (cached) {
      console.log('[Redis] Cache hit')
      return res.json(JSON.parse(cached))
    }

    console.log('[Redis] Cache miss - fetching from MongoDB')
    const products = await Product.find()
    const response = {
      status: 'success',
      data: products,
      message: 'Product catalog retrieved successfully'
    }

    try {
      await redis.set(CACHE_KEY, JSON.stringify(response), 'EX', CACHE_TTL)
    } catch (redisErr) {
      console.log('[Redis] Failed to cache - continuing without cache')
    }

    res.json(response)
  } catch (error) {
    console.error('[products-service] Error:', error.message)
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Exception: Products service failed.'
    })
  }
})

module.exports = router
