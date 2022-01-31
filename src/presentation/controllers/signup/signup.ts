import { EmailValidator, Controller, HttpResponse, HttpRequest, AddAccount } from './signup-protocols'
import { MissingParamError, InvalidParamError } from '../../errors/index'
import { badRequest, serverError, ok } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator, private readonly addAccount: AddAccount) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      await this.addAccount.add({
        name,
        email,
        password
      })
      return ok('create on success')
    } catch (error) {
      return serverError()
    }
  }
}
