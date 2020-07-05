import { MockProxy, mock } from 'jest-mock-extended'
import { Encrypter, AddAccountRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
import { AccountModel } from '../../../domain/models/account-model'
import { AddAccountModel } from '../../../domain/models/add-account-model'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password'
})

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

interface SutType {
  sut: DbAddAccount
  encrypterStub: MockProxy<Encrypter>
  addAccountRepositoryStub: MockProxy<AddAccountRepository>
}

const makeSut = (): SutType => {
  const encrypterStub = mock<Encrypter>()
  encrypterStub.encrypt.mockReturnValue(Promise.resolve('hashed_password'))

  const addAccountRepositoryStub = mock<AddAccountRepository>()
  addAccountRepositoryStub.add.mockReturnValue(
    Promise.resolve(makeFakeAccount())
  )

  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  }
}

describe('Db Add Account', () => {
  describe('Encrypter', () => {
    test('should call Encrypter with correct password', async () => {
      const { sut, encrypterStub } = makeSut()

      await sut.add(makeFakeAccountData())
      expect(encrypterStub.encrypt).toBeCalledWith('valid_password')
    })

    test('should throw if Encrypter throws', async () => {
      const { sut, encrypterStub } = makeSut()
      encrypterStub.encrypt.mockImplementationOnce(() => {
        throw new Error()
      })

      const result = sut.add(makeFakeAccountData())
      await expect(result).rejects.toThrow()
    })
  })

  describe('Add Account Repository', () => {
    test('should call AddAccountRepository with correct values', async () => {
      const { sut, addAccountRepositoryStub } = makeSut()

      await sut.add({
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
      })
      expect(addAccountRepositoryStub.add).toBeCalledWith({
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'hashed_password'
      })
    })

    test('should throw if AddAccountRespository throws', async () => {
      const { sut, addAccountRepositoryStub } = makeSut()
      addAccountRepositoryStub.add.mockImplementationOnce(() => {
        throw new Error()
      })

      const result = sut.add(makeFakeAccountData())
      await expect(result).rejects.toThrow()
    })

    test('should return an account on success', async () => {
      const { sut } = makeSut()

      const result = await sut.add(makeFakeAccountData())
      await expect(result).toEqual(makeFakeAccount())
    })
  })
})
