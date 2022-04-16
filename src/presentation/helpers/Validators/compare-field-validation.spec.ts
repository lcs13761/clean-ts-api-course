import { InvalidParamError } from '../../errors'
import { CompareFieldValidation } from './compare-field-validation'

const makeSut = (): CompareFieldValidation => {
  return new CompareFieldValidation('field', 'fieldToCompareName')
}

describe('RequiredField Validation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_field', fieldToCompareName: 'wrong_field' })
    expect(error).toEqual(new InvalidParamError('fieldToCompareName'))
  })

  test('should not if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_field', fieldToCompareName: 'any_field' })
    expect(error).toBeFalsy()
  })
})
