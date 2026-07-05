const request = require('supertest')
const express = require('express')
const authRouter = require('../routes')

// set up a mini express app just for testing
// this way we don't need to start the actual server
const app = express()
app.use(express.json())
app.use('/api/auth', authRouter)

describe('POST /api/auth/login', () => {
  // test the happy path first - correct email and password
  it('should return token when credentials are correct', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@finmark.com',
        password: 'Password123!'
      })

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Login successful')
    expect(res.body.token).toBe('fm_dev_a1b2c3d4e5f6')
  })

  // wrong password should fail
  it('should return 401 when password is wrong', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@finmark.com',
        password: 'wrongpassword'
      })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid email or password')
  })

  // missing fields should also fail - the backend treats empty/undefined as invalid
  it('should return 401 when fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: '',
        password: ''
      })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid email or password')
  })
})
