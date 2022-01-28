import { DbAddAccount } from './db-add-account'
import { Encrypter } from './db-add-account-protocols'

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
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('password')
  })

  test('should throw if Encrypt throws', async () => {
    const { sut, encrypterStup } = makeSut()
    jest.spyOn(encrypterStup, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid',
      email: 'valid@example.com',
      password: 'password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
})
