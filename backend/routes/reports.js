const express = require("express");
const router = express.Router();

// We changed the path from '/' to '/summary' to match what our frontend expects
router.get("/summary", (req, res) => {
  try {
    // NOTE FOR THE TEAM: Member 2 (Mock Data) and Member 3 (Logic calculation loop)
    // will replace this block with the filtered data loop.

    // Member 1 Gateway Response:
    // Alvin's mock dataset - 2 clean, 2 corrupted
    const orders = [
      { totalRevenue: 150.0, totalItemsSold: 3 },
      { totalRevenue: null, totalItemsSold: 1 },
      { totalRevenue: 75.5, totalItemsSold: undefined },
      { totalRevenue: 200.0, totalItemsSold: 5 },
    ];

    let totalRevenue = 0;
    let totalItemsSold = 0;

    // loop through each order, skip corrupted records
    for (const order of orders) {
      if (!order.totalRevenue || !order.totalItemsSold) {
        console.log("[System Notice] Corrupted record skipped safely.");
        continue;
      }
      totalRevenue += order.totalRevenue;
      totalItemsSold += order.totalItemsSold;
    }

    res.json({
      metrics: {
        totalRevenue: totalRevenue,
        totalItemsSold: totalItemsSold,
      },
    });
  } catch (error) {
    // Defensive coding safety net to fulfill our track resiliency requirement
    res.status(500).json({
      status: "Error",
      message:
        "Internal Server Exception: Data pipeline interrupted gracefully.",
    });
  }
});

module.exports = router;
