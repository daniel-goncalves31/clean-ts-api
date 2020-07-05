import { LogErrorRepository } from '@/data/protocols/log-error-repository'
import { MongoDbHelper } from '../helpers/mongodb-helper'

export class LogMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorCollection = await MongoDbHelper.instance.getCollection('errors')
    await errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
