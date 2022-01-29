import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helpers'
import app from '../config/app'

describe('SignUp Routes', () => {
  beforeAll(async () => { await MongoHelper.connect(process.env.MONGO_URL as string) })

  afterAll(async () => { await MongoHelper.disconnect() })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })
  test('should retrun an account on success', async () => {
    await request(app).post('/api/signup').send({
      name: 'test',
      email: 'test@example.com',
      password: 'password',
      passwordConfirmation: 'password'
    }).expect(200)
  })
})
