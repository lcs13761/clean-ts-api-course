import { AccountModel } from '../../../domain/models/accout'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { Encrypter } from '../../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    // eslint-disable-next-line @typescript-eslint/quotes
    return new Promise(resolve => resolve({ ...account, id: "valid_id" }))
  }
}
