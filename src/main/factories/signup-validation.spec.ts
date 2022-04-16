import { CompareFieldValidation } from '../../presentation/helpers/Validators/compare-field-validation'
import { EmailValidation } from '../../presentation/helpers/Validators/email-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/Validators/required-field-validation'
import { Validation } from '../../presentation/helpers/Validators/validation'
import { ValidationComposite } from '../../presentation/helpers/Validators/validation-composite'
import { EmailValidator } from '../../presentation/protocols/email-validator'
import { makeSignupValidation } from './signup-validation'

jest.mock('../../presentation/helpers/Validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStup implements EmailValidator {
    isValid(email: string): boolean { return true }
  }
  return new EmailValidatorStup()
}

describe('makeSignupValidation Factory', () => {
  test('Should call ValidationComposite with all validatations', () => {
    makeSignupValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
