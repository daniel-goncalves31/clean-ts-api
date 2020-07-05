import { mock, MockProxy } from 'jest-mock-extended'
import { Controller, HttpResponse, HttpRequest } from '@/presentation/protocols'
import { LogControllerDecorator } from './log-decorator'

interface SutType {
  sut: LogControllerDecorator
  controllerStub: MockProxy<Controller>
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

  const sut = new LogControllerDecorator(controllerStub)

  return {
    sut,
    controllerStub
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
})
