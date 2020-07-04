import { SignUpController } from './signup'
import { mock, MockProxy } from 'jest-mock-extended'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { AddAccount, EmailValidator } from './signup-protocols'

interface SutType {
  sut: SignUpController
  emailValidatorStub: MockProxy<EmailValidator>
  addAccountStub: MockProxy<AddAccount>
}

const makeSut = (): SutType => {
  const emailValidatorStub = mock<EmailValidator>()
  emailValidatorStub.isValid.mockReturnValue(true)

  const addAccountStub = mock<AddAccount>()
  addAccountStub.add.mockReturnValue({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'valid_password'
  })

  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  describe('Bad Request', () => {
    test('Should return 400 if no name is provided', () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('Should return 400 if no email is provided', () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          name: 'any_name',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('Should return 400 if no password is provided', () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email@mail.com',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('Should return 400 if no password confirmation is provided', () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      }
      const httpResponse = sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(
        new MissingParamError('passwordConfirmation')
      )
    })

    test('Should return 400 if passwords do not match', () => {
      const { sut } = makeSut()

      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'invalid_password'
        }
      }
      const httpResponse = sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(
        new InvalidParamError('passwordConfirmation')
      )
    })

    test('Should return 400 if an invalid email is provided', () => {
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
      const httpResponse = sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })
  })

  describe('Email Validator', () => {
    test('Should call EmailValidator with correct email', () => {
      const { sut, emailValidatorStub } = makeSut()
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      sut.handle(httpRequest)
      expect(emailValidatorStub.isValid).toHaveBeenCalledWith(
        'any_email@mail.com'
      )
    })

    test('Should return 500 if EmailValidator throws', () => {
      const { sut, emailValidatorStub } = makeSut()
      emailValidatorStub.isValid.mockImplementationOnce(() => {
        throw new Error()
      })
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError())
    })
  })

  describe('Add Account', () => {
    test('Should call AddAccount usecase with correct values', () => {
      const { sut, addAccountStub } = makeSut()

      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      sut.handle(httpRequest)
      expect(addAccountStub.add).toHaveBeenCalledWith({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
    })

    test('Should return 500 if AddAccount throws', () => {
      const { sut, addAccountStub } = makeSut()
      addAccountStub.add.mockImplementationOnce(() => {
        throw new Error()
      })

      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Should return 200 if if valid data is provided', () => {
      const { sut } = makeSut()

      const httpRequest = {
        body: {
          name: 'valid_name',
          email: 'valid_email@email.com',
          password: 'valid_password',
          passwordConfirmation: 'valid_password'
        }
      }

      const httpResponse = sut.handle(httpRequest)
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
