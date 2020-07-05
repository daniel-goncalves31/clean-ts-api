import { MongoDbHelper as sut } from './mongodb-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.instance.connect(process.env.MONGO_URL as any)
  })

  afterAll(async () => {
    await sut.instance.disconnect()
  })

  test('Should reconnect if mongodb is down', async () => {
    let accountCollection = await sut.instance.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await sut.instance.disconnect()
    accountCollection = await sut.instance.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })
})
