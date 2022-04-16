import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'
import { Validation } from './validation'

export class EmailValidation implements Validation {
  constructor(private readonly filedName: string, private readonly emailValidator: EmailValidator) { }

  validate(input: any): Error | null {
    const isValid = this.emailValidator.isValid(input[this.filedName])
    if (!isValid) return new InvalidParamError(this.filedName)
    return null
  }
}
