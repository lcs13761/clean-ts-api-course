import { LogControllerDecorator } from './log'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { ok, serverError } from '../../presentation/helpers/http-helper'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise(resolve => resolve(ok({ name: 'test' })))
    }
  }
  return new ControllerStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'foo@example',
    name: 'foo_any',
    password: 'foo',
    passwordConfirmation: 'foo'
  }
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStup implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new LogErrorRepositoryStup()
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStup: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStup = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStup)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStup
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(makeFakeRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ name: 'test' }))
  })

  test('Should call LogErrorRepository with correct if controller return a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStup } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStup, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(makeFakeServerError())))
    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
