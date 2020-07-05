import { mock, MockProxy } from 'jest-mock-extended'
import {
  Controller,
  HttpResponse,
  HttpRequest
} from '../../presentation/protocols'
import { LogControllerDecorator } from './log-decorator'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { serverError } from '../../presentation/helpers/http-helpers'
import { AccountModel } from '../../domain/models/account-model'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

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
      body: makeFakeAccount()
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
    await sut.handle(makeFakeRequest())
    expect(controllerStub.handle).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: makeFakeAccount()
    })
  })

  test('should call LogRepositoryError with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepository } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'

    controllerStub.handle.mockReturnValue(
      Promise.resolve(serverError(fakeError))
    )
    await sut.handle(makeFakeRequest())

    expect(logErrorRepository.log).toHaveBeenCalledWith(fakeError.stack)
  })
})
