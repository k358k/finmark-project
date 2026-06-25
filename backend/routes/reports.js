const express = require('express')
const router = express.Router()

// We changed the path from '/' to '/summary' to match what our frontend expects
router.get('/summary', (req, res) => {
  try {
    // NOTE FOR THE TEAM: Member 2 (Mock Data) and Member 3 (Logic calculation loop)
    // will replace this block with the filtered data loop.
    
    // Member 1 Gateway Response:
    res.json({ 
      status: 'Success', 
      message: 'Analytics gateway open and secure. Ready for data injection.' 
    })
    
  } catch (error) {
    // Defensive coding safety net to fulfill our track resiliency requirement
    res.status(500).json({ 
      status: 'Error',
      message: 'Internal Server Exception: Data pipeline interrupted gracefully.' 
    })
  }
})

module.exports = router