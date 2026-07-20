const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const connectDB = require('./shared/db')
const Report = require('./models/Report') // 1. Import your Report model

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/reports', routes)

const PORT = Number(process.env.PORT)
const STANDBY_PORT = 3014
if (!PORT) {
  console.error('PORT environment variable is required')
  process.exit(1)
}

// 2. Define the auto-seed function
const seedDatabase = async () => {
    try {
        const count = await Report.countDocuments();
        if (count === 0) {
            console.log('[Auto-Seed] Reports database is empty. Inserting initial data...');
            await Report.insertMany([
                { totalRevenue: 150.00, totalItemsSold: 3, orderDate: new Date('2024-01-15') },
                { totalRevenue: null, totalItemsSold: 1, orderDate: new Date('2024-01-15') },
                { totalRevenue: 200.00, totalItemsSold: 5, orderDate: new Date('2024-01-16') },
                { totalRevenue: 75.50, totalItemsSold: null, orderDate: new Date('2024-01-16') },
                { totalRevenue: 320.00, totalItemsSold: 8, orderDate: new Date('2024-01-17') },
                { totalRevenue: 99.99, totalItemsSold: null, orderDate: new Date('2024-01-17') },
                { totalRevenue: 450.00, totalItemsSold: 10, orderDate: new Date('2024-01-18') },
                { totalRevenue: 180.75, totalItemsSold: 4, orderDate: new Date('2024-01-18') },
                { totalRevenue: null, totalItemsSold: 2, orderDate: new Date('2024-01-19') },
                { totalRevenue: 530.00, totalItemsSold: 12, orderDate: new Date('2024-01-19') }
            ]);
            console.log('[Auto-Seed] Reports seeded successfully!');
        }
    } catch (err) {
        console.error('[Auto-Seed] Error seeding reports:', err);
    }
};

connectDB().then(async () => {
  // 3. Run the auto-seed right after successful DB connection
  await seedDatabase();

  app.listen(PORT, () => {
    if (PORT === STANDBY_PORT) {
      console.log(`[reports-service] ⚡ STANDBY instance now serving on port ${PORT}`)
    } else {
      console.log(`[reports-service] ✅ ACTIVE instance running on port ${PORT}`)
    }
  })
}).catch((err) => {
  console.error('[reports-service] Failed to connect to MongoDB:', err.message)
  process.exit(1)
})