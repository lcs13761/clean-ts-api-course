import { mockAccountModel } from '../../domain/test/mock-account'
import { Authentication, AuthenticationParams } from '../controllers/login/login-protocols'
import { AccountModel } from '../controllers/signup/signup-protocols'

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationParams): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }

  return new AuthenticationStub()
}
