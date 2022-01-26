import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encrypter'

interface SutTypes {
  sut: DbAddAccount
  encrypterStup: Encrypter
}

const makeSut = (): SutTypes => {
  class EncrypterStup {
    async encrypt (value: string): Promise<string> {
      return new Promise<string>(resolve => resolve('hasPassword'))
    }
  }
  const encrypterStup = new EncrypterStup()
  const sut = new DbAddAccount(encrypterStup)
  return {
    sut,
    encrypterStup
  }
}

describe('DbAddAccount Usecase', () => {
  test('should call Encrypt with correct password', async () => {
    const { sut, encrypterStup } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStup, 'encrypt')
    const accountData = {
      name: 'valid',
      email: 'valid@example.com',
      password: 'password'
    }
    sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('password')
  })
})
