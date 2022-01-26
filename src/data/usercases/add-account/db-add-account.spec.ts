import { DbAddAccount } from './db-add-account'

describe('DbAddAccount Usecase', () => {
  test('should call Encrypt with correct password', async () => {
    class EncrypterStup {
      async encrypt (value: string): Promise<string> {
        return new Promise<string>(resolve => resolve('hasPassword'))
      }
    }
    const encrypterStup = new EncrypterStup()
    const sut = new DbAddAccount(encrypterStup)
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
