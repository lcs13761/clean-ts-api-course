import { LoginController } from './login'
import { badRequest, serverError, unauthorized } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'
import { mockValidation } from '../../test'
import { HttpRequest, Authentication, Validation } from './login-protocols'
import { mockAuthentication } from '../../test/mock-account'
import { throwsError } from '../../../domain/test/test-helpers'

const mockRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type SutTypes = {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const authenticationStub = mockAuthentication()
  const validationStub = mockValidation()
  const sut = new LoginController(validationStub, authenticationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(mockRequest().body)
    expect(authSpy).toHaveBeenCalledWith(mockRequest().body)
  })

  test('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest().body)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(throwsError)
    const httpResponse = await sut.handle(mockRequest().body)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest().body)
    expect(httpResponse.statusCode).toEqual(200)
  })

  test('Should call Validation with correct value ', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(mockRequest().body)
    expect(validateSpy).toHaveBeenCalledWith(mockRequest().body)
  })

  test('Should return 400 if Validation returns an error ', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(mockRequest().body)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
