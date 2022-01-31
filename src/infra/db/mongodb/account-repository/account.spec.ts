import { MongoHelper } from '../../mongodb/helpers/mongo-helpers'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
  beforeAll(async () => { await MongoHelper.connect(process.env.MONGO_URL as string) })

  afterAll(async () => { await MongoHelper.disconnect() })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('Should return an account on success', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'any',
      email: 'any_email@gmail.com',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
  })
})
