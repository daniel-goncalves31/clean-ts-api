import { MongoClient, Collection } from 'mongodb'

export class MongoDbHelper {
  private client: MongoClient | null = null
  private static _instance: MongoDbHelper

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor () {}

  static get instance (): MongoDbHelper {
    if (!MongoDbHelper._instance) {
      MongoDbHelper._instance = new MongoDbHelper()
    }
    return MongoDbHelper._instance
  }

  async connect (): Promise<void> {
    this.client = await MongoClient.connect(process.env.MONGO_URL as any, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }

  getCollection (collectionName: string): Collection {
    return this.client?.db().collection(collectionName) as any
  }

  map (collection: any): any {
    const { _id, ...collectionWithoutId } = collection
    return { ...collectionWithoutId, id: _id }
  }

  async disconnect (): Promise<void> {
    await this.client?.close()
  }
}
