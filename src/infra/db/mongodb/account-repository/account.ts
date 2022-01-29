import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { MongoHelper } from '../helpers/mongo-helpers'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    return result.insertedId !== null
  }
}
