import { MissingParamError } from '../../errors'
import { Validation } from './validation'

export class RequiredFieldValidation implements Validation {
  constructor(private readonly filedName: string) { }

  validate(input: any): Error | null {
    if (!input[this.filedName]) {
      return new MissingParamError(this.filedName)
    }
    return null
  }
}
