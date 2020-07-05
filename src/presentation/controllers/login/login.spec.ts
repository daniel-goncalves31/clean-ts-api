import { LoginController } from './login'
import { HttpRequest } from '../sign-up/signup-protocols'
import { badRequest } from '../../helpers/http-helpers'
import { MissingParamError } from '../../errors'

interface SutType {
  sut: LoginController
}

const makeSut = (): SutType => {
  const sut = new LoginController()

  return {
    sut
  }
}

describe('LoginController', () => {
  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@email.com'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
