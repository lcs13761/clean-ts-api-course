import { DbAddAccount } from './db-add-account'
import { Encrypter, AddAccountRepository, AddAccount } from './db-add-account-protocols'

const makeEncrypter = (): Encrypter => {
  class EncrypterStup implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise<string>(resolve => resolve('hasPassword'))
    }
  }
  return new EncrypterStup()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStup implements AddAccountRepository {
    async add (accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
      return true
    }
  }
  return new AddAccountRepositoryStup()
}

interface SutTypes {
  sut: DbAddAccount
  encrypterStup: Encrypter
  addAccountRepositoryStup: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const encrypterStup = makeEncrypter()
  const addAccountRepositoryStup = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStup, addAccountRepositoryStup)
  return {
    sut,
    encrypterStup,
    addAccountRepositoryStup
  }
}

const makeFakeHttpRequest = (): AddAccount.Params => ({
  name: 'valid',
  email: 'valid@example.com',
  password: 'password'
})

describe('DbAddAccount Usecase', () => {
  test('should call Encrypt with correct password', async () => {
    const { sut, encrypterStup } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStup, 'encrypt')
    await sut.add(makeFakeHttpRequest())
    expect(encryptSpy).toHaveBeenCalledWith('password')
  })

  test('should throw if Encrypt throws', async () => {
    const { sut, encrypterStup } = makeSut()
    jest.spyOn(encrypterStup, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeFakeHttpRequest())
    await expect(promise).rejects.toThrow()
  })

  test('should call addAccountRepository with correct value', async () => {
    const { sut, addAccountRepositoryStup } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStup, 'add')
    await sut.add(makeFakeHttpRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid',
      email: 'valid@example.com',
      password: 'hasPassword'
    })
  })

  test('should throw if Encrypt throws', async () => {
    const { sut, addAccountRepositoryStup } = makeSut()
    jest.spyOn(addAccountRepositoryStup, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeFakeHttpRequest())
    await expect(promise).rejects.toThrow()
  })

  test('should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeHttpRequest())
    expect(account).toBeTruthy()
  })
})
