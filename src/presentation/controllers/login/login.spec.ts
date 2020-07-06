import { LoginController } from './login'
import { HttpRequest, EmailValidator } from '../sign-up/signup-protocols'
import { badRequest } from '../../helpers/http-helpers'
import { MissingParamError, InvalidParamError } from '../../errors'
import { MockProxy, mock } from 'jest-mock-extended'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@email.com',
    password: 'any_password'
  }
})

interface SutType {
  sut: LoginController
  emailValidatorStub: MockProxy<EmailValidator>
}

const makeSut = (): SutType => {
  const emailValidatorStub = mock<EmailValidator>()
  emailValidatorStub.isValid.mockReturnValue(true)

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

  describe('Email Validator', () => {
    test('should call EmailValidator with correct email', async () => {
      const { sut, emailValidatorStub } = makeSut()

      await sut.handle(makeFakeRequest())
      expect(emailValidatorStub.isValid).toHaveBeenCalledWith(
        makeFakeRequest().body.email
      )
    })

    test('should returns 400 if an invalid email is provided', async () => {
      const { sut, emailValidatorStub } = makeSut()
      emailValidatorStub.isValid.mockReturnValueOnce(false)

      const httpResponse = await sut.handle(makeFakeRequest())
      expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    })
  })
})
