import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  test('should retrun an account on success', async () => {
    await request(app).post('/api/signup').send({
      name: 'test',
      email: 'test@example.com',
      password: 'password',
      passwordConfirmation: 'password'
    }).expect(200)
  })
})
