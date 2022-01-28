import { AddAccount, AddAccountModel, AccountModel, Encrypter } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    // eslint-disable-next-line @typescript-eslint/quotes
    return new Promise(resolve => resolve({ ...account, id: "valid_id" }))
  }
}
