import { SignUpController } from './signup'
import { MissingParamError } from '../../errors/index'
import { AddAccount, HttpRequest, Validation } from './signup-protocols'
import { badRequest, ok, serverError } from '../../helpers/http-helper'

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccount.Params): Promise<AddAccount.Result> {
      return true
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): null | Error {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(addAccountStub, validationStub)
  return {
    sut,
    addAccountStub,
    validationStub
  }
}
const makeFakeError = (): Error => {
  const fakeError = new Error()
  fakeError.stack = 'Error'
  return fakeError
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'foom',
    email: 'foo@example.com',
    password: 'password',
    passwordConfirmation: 'password'
  }
})

describe('SignUp Controller', () => {
  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse).toEqual(serverError(makeFakeError()))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'foom',
      email: 'foo@example.com',
      password: 'password'
    })
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok('create on success'))
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpRequest = await sut.handle(makeFakeRequest())
    expect(httpRequest).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
