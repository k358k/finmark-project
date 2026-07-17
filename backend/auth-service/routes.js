const express = require('express')
const argon2 = require('argon2')
const User = require('./models/User')
const router = express.Router()

router.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const valid = await argon2.verify(user.password, password)
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.json({
      message: 'Login successful',
      token: 'fm_dev_a1b2c3d4e5f6',
    })
  } catch (error) {
    console.error('[auth-service] Error:', error.message)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router
