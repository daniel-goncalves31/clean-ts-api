import request from 'supertest'
import app from '../config/app'
import { MongoDbHelper } from '../../infra/db/mongodb/helpers/mongodb-helper'
import { env } from '../config/env'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoDbHelper.instance.connect(env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoDbHelper.instance.disconnect()
  })

  afterEach(async () => {
    const accountCollection = MongoDbHelper.instance.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      })
      .expect(200)
  })
})
