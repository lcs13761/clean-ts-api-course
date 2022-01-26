import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encrypter'

interface SutTypes {
  sut: DbAddAccount
  encrypterStup: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStup implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise<string>(resolve => resolve('hasPassword'))
    }
  }
  return new EncrypterStup()
}

const makeSut = (): SutTypes => {
  const encrypterStup = makeEncrypter()
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
