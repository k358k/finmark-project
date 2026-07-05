const express = require('express')
const router = express.Router()

router.post('/login', (req, res) => {
    const { email, password } = req.body

    // check if credentials match the mock user
    if (email === 'admin@finmark.com' && password === 'Password123!') {
        res.json ({
            message: 'Login successful',
            token: 'fm_dev_a1b2c3d4e5f6',
        })
    } else {
        res.status(401).json({
            message: 'Invalid email or password'
        })
    }
})

module.exports = router
