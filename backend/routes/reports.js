const express = require('express')
const router = express.Router()

// MEMBER 2 (Mock Data Architect): Raw Transaction Stream
const mockOrderStream = [
  { totalRevenue: 150.00,  totalItemsSold: 3         },  // Order  1: Perfect Data
  { totalRevenue: null,    totalItemsSold: 1         },  // Order  2: Corrupted - Missing Revenue
  { totalRevenue: 200.00,  totalItemsSold: 5         },  // Order  3: Perfect Data
  { totalRevenue: 75.50,   totalItemsSold: undefined },  // Order  4: Corrupted - Missing Items
  { totalRevenue: 320.00,  totalItemsSold: 8         },  // Order  5: Perfect Data
  { totalRevenue: 99.99,   totalItemsSold: undefined },  // Order  6: Corrupted - Missing Items
  { totalRevenue: 450.00,  totalItemsSold: 10        },  // Order  7: Perfect Data
  { totalRevenue: 180.75,  totalItemsSold: 4         },  // Order  8: Perfect Data
  { totalRevenue: null,    totalItemsSold: 2         },  // Order  9: Corrupted - Missing Revenue
  { totalRevenue: 530.00,  totalItemsSold: 12        },  // Order 10: Perfect Data
  { totalRevenue: 95.00,   totalItemsSold: 2         },  // Order 11: Perfect Data
  { totalRevenue: 210.50,  totalItemsSold: undefined },  // Order 12: Corrupted - Missing Items
  { totalRevenue: 640.00,  totalItemsSold: 15        },  // Order 13: Perfect Data
  { totalRevenue: 375.25,  totalItemsSold: 9         },  // Order 14: Perfect Data
  { totalRevenue: null,    totalItemsSold: 7         },  // Order 15: Corrupted - Missing Items
]

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