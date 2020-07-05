import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('Email Validator Adapter', () => {
  test('should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isValid = sut.isValid('invalid_email@email.com')
    expect(isValid).toBe(false)
  })

  test('should return true if validator returns true', () => {
    const sut = makeSut()

    const isValid = sut.isValid('valid_email@email.com')
    expect(isValid).toBe(true)
  })

  test('should call validator with correct email', () => {
    const sut = makeSut()
    const emailValidatorSpy = jest.spyOn(validator, 'isEmail')

    sut.isValid('any_email@email.com')
    expect(emailValidatorSpy).toHaveBeenCalledWith('any_email@email.com')
  })
})
