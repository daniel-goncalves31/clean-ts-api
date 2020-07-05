import { mock, MockProxy } from 'jest-mock-extended'
import {
  Controller,
  HttpResponse,
  HttpRequest
} from '../../presentation/protocols'
import { LogControllerDecorator } from './log-decorator'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { serverError } from '../../presentation/helpers/http-helpers'

interface SutType {
  sut: LogControllerDecorator
  controllerStub: MockProxy<Controller>
  logErrorRepository: MockProxy<LogErrorRepository>
}

const makeSut = (): SutType => {
  const controllerStub = mock<Controller>()
  controllerStub.handle.mockImplementation(async () => {
    const httpResponse: HttpResponse = {
      statusCode: 200,
      body: {
        name: 'valid_name'
      }
    }
    return Promise.resolve(httpResponse)
  })

  const logErrorRepository = mock<LogErrorRepository>()

  const sut = new LogControllerDecorator(controllerStub, logErrorRepository)

  return {
    sut,
    controllerStub,
    logErrorRepository
  }
}

describe('LogDecorator', () => {
  test('should calls controller with correct value', async () => {
    const { sut, controllerStub } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(controllerStub.handle).toHaveBeenCalledWith(httpRequest)
  })

  test('should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'valid_name'
      }
    })
  })

  test('should call LogRepositoryError with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepository } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const fakeError = new Error()
    fakeError.stack = 'any_stack'

    controllerStub.handle.mockReturnValue(
      Promise.resolve(serverError(fakeError))
    )
    await sut.handle(httpRequest)

    expect(logErrorRepository.log).toHaveBeenCalledWith(fakeError.stack)
  })
})
