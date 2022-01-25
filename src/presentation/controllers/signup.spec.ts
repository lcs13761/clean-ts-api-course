import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'
import { ServerError } from '../errors/server-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { EmailValidator } from '../protocols/email-validator'


interface SutTypes {
  sut: SignUpController
  emailValidatorStup: EmailValidator
}

const makeSut = (): SutTypes => {
  class EmailValidatorStup implements EmailValidator {
    isValid (email: string): boolean { return true }
  }
  const emailValidatorStup = new EmailValidatorStup()
  const sut = new SignUpController(emailValidatorStup)
  return {
    sut,
    emailValidatorStup
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'foo@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'foom',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'foom',
        email: 'foo@example.com',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'foom',
        email: 'foo@example.com',
        password: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if as invalid email is provided', () => {
    const { sut, emailValidatorStup } = makeSut()
    jest.spyOn(emailValidatorStup, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'foom',
        email: 'foo@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStup } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStup, 'isValid')
    const httpRequest = {
      body: {
        name: 'foom',
        email: 'foo@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('foo@example.com')
  })

  test('Should return 500 if EmailValidator throws', () => {
    class EmailValidatorStup implements EmailValidator {
      isValid (email: string): boolean {
        throw new Error()
      }
    }
    const emailValidatorStup = new EmailValidatorStup()
    const sut = new SignUpController(emailValidatorStup)
    const httpRequest = {
      body: {
        name: 'foom',
        email: 'foo@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
