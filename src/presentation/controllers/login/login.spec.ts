import { LoginController } from './login'
import { HttpRequest, EmailValidator } from '../sign-up/signup-protocols'
import {
  badRequest,
  serverError,
  unauthorized
} from '../../helpers/http-helpers'
import { MissingParamError, InvalidParamError } from '../../errors'
import { MockProxy, mock } from 'jest-mock-extended'
import { Authentication } from '../../../domain/usecases/authentication'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@email.com',
    password: 'any_password'
  }
})

interface SutType {
  sut: LoginController
  emailValidatorStub: MockProxy<EmailValidator>
  authenticationStub: MockProxy<Authentication>
}

const makeSut = (): SutType => {
  const emailValidatorStub = mock<EmailValidator>()
  emailValidatorStub.isValid.mockReturnValue(true)

  const authenticationStub = mock<Authentication>()

  const sut = new LoginController(emailValidatorStub, authenticationStub)

  return {
    sut,
    emailValidatorStub,
    authenticationStub
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

    test('should throw if EmailValidator throws', async () => {
      const { sut, emailValidatorStub } = makeSut()
      emailValidatorStub.isValid.mockImplementationOnce(() => {
        throw new Error()
      })

      const httpResponse = await sut.handle(makeFakeRequest())
      expect(httpResponse).toEqual(serverError(new Error()))
    })
  })

  describe('Authentication', () => {
    test('should call Authentication with correct values', async () => {
      const { sut, authenticationStub } = makeSut()
      const { email, password } = makeFakeRequest().body
      await sut.handle(makeFakeRequest())
      expect(authenticationStub.auth).toBeCalledWith(email, password)
    })

    test('should return 401 if invalid credentials are provided', async () => {
      const { sut, authenticationStub } = makeSut()
      authenticationStub.auth.mockReturnValueOnce(Promise.resolve(null))

      const httpResponse = await sut.handle(makeFakeRequest())
      expect(httpResponse).toEqual(unauthorized())
    })
  })
})
