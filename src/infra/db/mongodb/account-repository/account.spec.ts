import { AccountMongoRepository } from './account'
import { MongoDbHelper } from '../helpers/mongodb-helper'

interface SutType {
  sut: AccountMongoRepository
}

const makeSut = (): SutType => {
  const sut = new AccountMongoRepository()

  return {
    sut
  }
}

describe('AccountMongoRepository', () => {
  beforeAll(async () => {
    await MongoDbHelper.instance.connect()
  })

  afterAll(async () => {
    await MongoDbHelper.instance.disconnect()
  })

  test('should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })
})
