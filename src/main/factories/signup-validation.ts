import { CompareFieldValidation } from '../../presentation/helpers/Validators/compare-field-validation'
import { EmailValidation } from '../../presentation/helpers/Validators/email-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/Validators/required-field-validation'
import { Validation } from '../../presentation/helpers/Validators/validation'
import { ValidationComposite } from '../../presentation/helpers/Validators/validation-composite'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

export const makeSignupValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
