import { LoginController } from './login'
import { HttpRequest, EmailValidator } from '../sign-up/signup-protocols'
import { badRequest } from '../../helpers/http-helpers'
import { MissingParamError } from '../../errors'
import { MockProxy, mock } from 'jest-mock-extended'

interface SutType {
  sut: LoginController
  emailValidatorStub: MockProxy<EmailValidator>
}

const makeSut = (): SutType => {
  const emailValidatorStub = mock<EmailValidator>()
  const sut = new LoginController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
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

  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    await sut.handle(httpRequest)
    expect(emailValidatorStub.isValid).toHaveBeenCalledWith(
      httpRequest.body.email
    )
  })
})
