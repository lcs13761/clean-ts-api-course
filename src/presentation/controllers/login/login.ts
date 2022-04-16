import { Authentication } from '../../../domain/usecases/authentication'
import { badRequest, serverError, ok, unauthorized } from '../../helpers/http-helper'
import { Controller, HttpResponse } from '../../protocols'
import { Validation } from '../signup/signup-protocols'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Request = {
  email: string
  password: string
}

export class LoginController implements Controller {
  constructor(private readonly validation: Validation, private readonly authentication: Authentication) { }

  async handle(request: Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) return badRequest(error)
      const authenticationModel = await this.authentication.auth(request)
      if (!authenticationModel) return unauthorized()
      return ok(authenticationModel)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
