require('dotenv').config({ path: './.env' })
const mongoose = require('mongoose')
const argon2 = require('argon2')

const MONGO_URI = process.env.MONGO_URI
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('[Seed] Missing required environment variables (MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD)')
  process.exit(1)
}

// ==================== SCHEMAS ====================

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true }
}, { timestamps: true })

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String },
  stock: { type: Number, default: 0 }
}, { timestamps: true })

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  quantity: { type: Number, required: true },
  orderValue: { type: Number, required: true },
  status: { type: String, default: 'placed' },
  orderId: { type: String, required: true, unique: true }
}, { timestamps: true })

const reportSchema = new mongoose.Schema({
  totalRevenue: { type: Number },
  totalItemsSold: { type: Number },
  orderDate: { type: Date }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)
const Product = mongoose.model('Product', productSchema)
const Order = mongoose.model('Order', orderSchema)
const Report = mongoose.model('Report', reportSchema)

// ==================== SEED DATA ====================

const products = [
  { name: 'Laptop Pro 15', description: '15-inch professional laptop', price: 1299.99, category: 'Electronics', stock: 25 },
  { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', price: 29.99, category: 'Accessories', stock: 150 },
  { name: 'USB-C Hub', description: '7-in-1 USB-C adapter', price: 49.99, category: 'Accessories', stock: 80 },
  { name: 'Monitor 27"', description: '27-inch 4K display', price: 399.99, category: 'Electronics', stock: 30 },
  { name: 'Keyboard Mechanical', description: 'RGB mechanical keyboard', price: 89.99, category: 'Accessories', stock: 60 }
]

const orders = [
  { customerName: 'Juan Dela Cruz', quantity: 2, orderValue: 2599.98, status: 'completed', orderId: 'FM-ORD-1001', createdAt: new Date('2024-01-15') },
  { customerName: 'Maria Santos', quantity: 1, orderValue: 1299.99, status: 'completed', orderId: 'FM-ORD-1002', createdAt: new Date('2024-01-16') },
  { customerName: 'Jose Reyes', quantity: 3, orderValue: 149.97, status: 'completed', orderId: 'FM-ORD-1003', createdAt: new Date('2024-01-17') },
  { customerName: 'Anna Cruz', quantity: 5, orderValue: 1999.95, status: 'completed', orderId: 'FM-ORD-1004', createdAt: new Date('2024-01-18') },
  { customerName: 'Pedro Garcia', quantity: 2, orderValue: 799.98, status: 'completed', orderId: 'FM-ORD-1005', createdAt: new Date('2024-01-19') },
  { customerName: 'Sofia Lim', quantity: 1, orderValue: 89.99, status: 'completed', orderId: 'FM-ORD-1006', createdAt: new Date('2024-01-20') },
  { customerName: 'Miguel Torres', quantity: 4, orderValue: 5199.96, status: 'completed', orderId: 'FM-ORD-1007', createdAt: new Date('2024-01-21') },
  { customerName: 'Isabella Ramos', quantity: 2, orderValue: 2699.98, status: 'completed', orderId: 'FM-ORD-1008', createdAt: new Date('2024-01-22') },
  { customerName: 'Carlos Mendoza', quantity: 3, orderValue: 149.97, status: 'completed', orderId: 'FM-ORD-1009', createdAt: new Date('2024-01-23') },
  { customerName: 'Elena Villanueva', quantity: 6, orderValue: 7799.94, status: 'completed', orderId: 'FM-ORD-1010', createdAt: new Date('2024-01-24') },
  { customerName: 'Roberto Santos', quantity: 1, orderValue: 399.99, status: 'completed', orderId: 'FM-ORD-1011', createdAt: new Date('2024-01-25') },
  { customerName: 'Lucia Fernando', quantity: 2, orderValue: 59.98, status: 'completed', orderId: 'FM-ORD-1012', createdAt: new Date('2024-01-26') },
  { customerName: 'Diego Bautista', quantity: 5, orderValue: 2499.95, status: 'completed', orderId: 'FM-ORD-1013', createdAt: new Date('2024-01-27') },
  { customerName: 'Camille Aquino', quantity: 3, orderValue: 1199.97, status: 'completed', orderId: 'FM-ORD-1014', createdAt: new Date('2024-01-28') },
  { customerName: 'Rafael Cruz', quantity: 2, orderValue: 179.98, status: 'completed', orderId: 'FM-ORD-1015', createdAt: new Date('2024-01-29') }
]

const reports = [
  { totalRevenue: 150.00, totalItemsSold: 3, orderDate: new Date('2024-01-15') },
  { totalRevenue: null, totalItemsSold: 1, orderDate: new Date('2024-01-15') },
  { totalRevenue: 200.00, totalItemsSold: 5, orderDate: new Date('2024-01-16') },
  { totalRevenue: 75.50, totalItemsSold: null, orderDate: new Date('2024-01-16') },
  { totalRevenue: 320.00, totalItemsSold: 8, orderDate: new Date('2024-01-17') },
  { totalRevenue: 99.99, totalItemsSold: null, orderDate: new Date('2024-01-17') },
  { totalRevenue: 450.00, totalItemsSold: 10, orderDate: new Date('2024-01-18') },
  { totalRevenue: 180.75, totalItemsSold: 4, orderDate: new Date('2024-01-18') },
  { totalRevenue: null, totalItemsSold: 2, orderDate: new Date('2024-01-19') },
  { totalRevenue: 530.00, totalItemsSold: 12, orderDate: new Date('2024-01-19') },
  { totalRevenue: 95.00, totalItemsSold: 2, orderDate: new Date('2024-01-20') },
  { totalRevenue: 210.50, totalItemsSold: null, orderDate: new Date('2024-01-20') },
  { totalRevenue: 640.00, totalItemsSold: 15, orderDate: new Date('2024-01-21') },
  { totalRevenue: 375.25, totalItemsSold: 9, orderDate: new Date('2024-01-21') },
  { totalRevenue: null, totalItemsSold: 7, orderDate: new Date('2024-01-22') }
]

// ==================== SEED FUNCTION ====================

async function seed() {
  console.log('[Seed] Connecting to MongoDB...')
  await mongoose.connect(MONGO_URI)
  console.log('[Seed] Connected successfully')

  // Hash password with argon2
  const passwordHash = await argon2.hash(ADMIN_PASSWORD)

  // Clear existing data
  await User.deleteMany({})
  await Product.deleteMany({})
  await Order.deleteMany({})
  await Report.deleteMany({})
  console.log('[Seed] Cleared existing data')

  // Insert users
  await User.create({
    email: ADMIN_EMAIL,
    password: passwordHash,
    name: 'Admin User'
  })
  console.log('[Seed] Users seeded')

  // Insert products
  await Product.insertMany(products)
  console.log('[Seed] Products seeded')

  // Insert orders
  await Order.insertMany(orders)
  console.log('[Seed] Orders seeded')

  // Insert reports
  await Report.insertMany(reports)
  console.log('[Seed] Reports seeded')

  console.log('[Seed] Seed data inserted successfully!')
  await mongoose.disconnect()
}

seed().catch(err => {
  console.error('[Seed] Error:', err.message)
  process.exit(1)
})
