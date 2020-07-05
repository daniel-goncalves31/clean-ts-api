import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

interface SutType {
  sut: BcryptAdapter
}

const makeSut = (): SutType => {
  const sut = new BcryptAdapter(12)

  return {
    sut
  }
}
describe('BcryptAdapter', () => {
  test('should ', async () => {
    const { sut } = makeSut()
    const bcryptSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(bcryptSpy).toHaveBeenCalledWith('any_value', 12)
  })
})
