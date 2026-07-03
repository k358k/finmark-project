const request = require('supertest')
const express = require('express')
const ordersRouter = require('../routes/orders')

const app = express()
app.use(express.json())
app.use('/api/orders', ordersRouter)

describe('POST /api/orders', () => {
  // normal order with all fields - should work
  it('should create order when all fields are provided', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        customerName: 'Juan Dela Cruz',
        quantity: 2,
        orderValue: 49.99
      })

    expect(res.status).toBe(201)
    expect(res.body.message).toBe('Order placed successfully')
    // order ID should start with FM-ORD-
    expect(res.body.orderId).toMatch(/^FM-ORD-/)
  })

  // missing customerName - should reject
  it('should return 400 when customerName is missing', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        quantity: 2,
        orderValue: 49.99
      })

    expect(res.status).toBe(400)
    expect(res.body.message).toContain('All fields are required')
  })

  // missing quantity - should also reject
  it('should return 400 when quantity is missing', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        customerName: 'Juan Dela Cruz',
        orderValue: 49.99
      })

    expect(res.status).toBe(400)
  })

  // empty body - should reject
  it('should return 400 when body is empty', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({})

    expect(res.status).toBe(400)
  })
})
