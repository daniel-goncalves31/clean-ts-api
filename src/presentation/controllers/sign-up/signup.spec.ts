import { SignUpController } from './signup'
import { mock, MockProxy } from 'jest-mock-extended'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import {
  AddAccount,
  EmailValidator,
  AccountModel,
  HttpRequest
} from './signup-protocols'
import { badRequest } from '../../helpers/http-helpers'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

interface SutType {
  sut: SignUpController
  emailValidatorStub: MockProxy<EmailValidator>
  addAccountStub: MockProxy<AddAccount>
}

const makeSut = (): SutType => {
  const emailValidatorStub = mock<EmailValidator>()
  emailValidatorStub.isValid.mockReturnValue(true)

  const addAccountStub = mock<AddAccount>()
  addAccountStub.add.mockReturnValue(Promise.resolve(makeFakeAccount()))

  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  describe('Bad Request', () => {
    test('Should return 400 if no name is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
    })

    test('Should return 400 if no email is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          name: 'any_name',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })

    test('Should return 400 if no password is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email@mail.com',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(
        badRequest(new MissingParamError('password'))
      )
    })

    test('Should return 400 if no password confirmation is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(
        badRequest(new MissingParamError('passwordConfirmation'))
      )
    })

    test('Should return 400 if passwords do not match', async () => {
      const { sut } = makeSut()

      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email@email.com',
          password: 'any_password',
          passwordConfirmation: 'invalid_password'
        }
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(
        new InvalidParamError('passwordConfirmation')
      )
    })

    test('Should return 400 if an invalid email is provided', async () => {
      const { sut, emailValidatorStub } = makeSut()
      emailValidatorStub.isValid.mockReturnValue(false)
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'invalid_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })
  })

  describe('Email Validator', () => {
    test('Should call EmailValidator with correct email', async () => {
      const { sut, emailValidatorStub } = makeSut()
      await sut.handle(makeFakeRequest())
      expect(emailValidatorStub.isValid).toHaveBeenCalledWith(
        'any_email@mail.com'
      )
    })

    test('Should return 500 if EmailValidator throws', async () => {
      const { sut, emailValidatorStub } = makeSut()
      emailValidatorStub.isValid.mockImplementationOnce(() => {
        throw new Error()
      })
      const httpResponse = await sut.handle(makeFakeRequest())
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError(''))
    })
  })

  describe('Add Account', () => {
    test('Should call AddAccount usecase with correct values', async () => {
      const { sut, addAccountStub } = makeSut()

      await sut.handle(makeFakeRequest())
      expect(addAccountStub.add).toHaveBeenCalledWith({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
    })

    test('Should return 500 if AddAccount throws', async () => {
      const { sut, addAccountStub } = makeSut()
      addAccountStub.add.mockImplementationOnce(() => {
        throw new Error()
      })

      const httpResponse = await sut.handle(makeFakeRequest())
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError(''))
    })

    test('Should return 200 if valid data is provided', async () => {
      const { sut } = makeSut()

      const httpRequest = {
        body: {
          name: 'valid_name',
          email: 'valid_email@email.com',
          password: 'valid_password',
          passwordConfirmation: 'valid_password'
        }
      }

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body).toEqual({
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
      })
    })
  })
})
