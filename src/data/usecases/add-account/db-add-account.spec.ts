import { MockProxy, mock } from 'jest-mock-extended'
import { Encrypter } from '@/data/protocols/encrypter'
import { DbAddAccount } from './db-add-account'

interface SutType {
  sut: DbAddAccount
  encrypterStub: MockProxy<Encrypter>
}

const makeSut = (): SutType => {
  const encrypterStub = mock<Encrypter>()
  const sut = new DbAddAccount(encrypterStub)

  return {
    sut,
    encrypterStub
  }
}

describe('Db Add Account', () => {
  test('should call encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encrypterStub.encrypt).toBeCalledWith('valid_password')
  })
})
