import { Collection } from 'mongodb'
import { MongoHelper } from '../../mongodb/helpers/mongo-helpers'
import { LogMongoRepository } from '../../mongodb/log-repository/log'

describe('Log Mongo Repository', () => {
  let errorCollection: Collection

  beforeAll(async () => { await MongoHelper.connect(process.env.MONGO_URL as string) })

  afterAll(async () => { await MongoHelper.disconnect() })

  beforeEach(async () => {
    errorCollection = MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  test('Should create an error log on success', async () => {
    const sut = new LogMongoRepository()
    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
