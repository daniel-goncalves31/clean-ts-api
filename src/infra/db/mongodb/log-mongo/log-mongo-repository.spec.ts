import { LogMongoRepository } from './log-mongo-repository'
import { MongoDbHelper } from '../helpers/mongodb-helper'
import { Collection } from 'mongodb'

interface SutType {
  sut: LogMongoRepository
}

const makeSut = (): SutType => {
  const sut = new LogMongoRepository()

  return {
    sut
  }
}

describe('LogMongoRepository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoDbHelper.instance.connect(process.env.MONGO_URL as any)
  })

  afterAll(async () => {
    await MongoDbHelper.instance.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoDbHelper.instance.getCollection('errors')
    await errorCollection.deleteMany({})
  })
  test('should create an error log', async () => {
    const { sut } = makeSut()
    await sut.logError('any_stack')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
