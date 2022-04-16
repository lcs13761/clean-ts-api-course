import { EmailValidation } from './email-validation'
import { EmailValidator } from '../../protocols/email-validator'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStup implements EmailValidator {
    isValid(email: string): boolean { return true }
  }
  return new EmailValidatorStup()
}

interface SutTypes {
  sut: EmailValidation
  emailValidatorStup: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStup = makeEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStup)
  return {
    sut,
    emailValidatorStup
  }
}

describe('Email Validation', () => {
  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStup } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStup, 'isValid')
    sut.validate({ email: 'foo@example.com' })
    expect(isValidSpy).toHaveBeenCalledWith('foo@example.com')
  })

  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStup } = makeSut()
    jest.spyOn(emailValidatorStup, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})
