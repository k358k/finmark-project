const request = require('supertest')
const express = require('express')
const reportsRouter = require('../routes')

const app = express()
app.use('/api/reports', reportsRouter)

describe('GET /api/reports/summary', () => {
  // the mock data has corrupted records (null/undefined values)
  // the endpoint should skip those and only sum valid ones
  it('should return correct totals from valid records only', async () => {
    const res = await request(app)
      .get('/api/reports/summary')

    expect(res.status).toBe(200)
    expect(res.body.metrics).toBeDefined()

    // calculated from the valid orders in the mock data:
    // orders 1,3,5,7,8,10,11,13,14 (skipping 2,4,6,9,12,15 which have null/undefined)
    // totalRevenue = 150+200+320+450+180.75+530+95+640+375.25 = 2941
    // totalItemsSold = 3+5+8+10+4+12+2+15+9 = 68
    expect(res.body.metrics.totalRevenue).toBe(2941)
    expect(res.body.metrics.totalItemsSold).toBe(68)
  })

  // sanity check - make sure the response structure is correct
  it('should have metrics object with totalRevenue and totalItemsSold', async () => {
    const res = await request(app)
      .get('/api/reports/summary')

    expect(res.body.metrics).toHaveProperty('totalRevenue')
    expect(res.body.metrics).toHaveProperty('totalItemsSold')
    // both should be numbers
    expect(typeof res.body.metrics.totalRevenue).toBe('number')
    expect(typeof res.body.metrics.totalItemsSold).toBe('number')
  })
})
