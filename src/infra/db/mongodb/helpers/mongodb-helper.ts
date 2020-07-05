import { MongoClient, Collection } from 'mongodb'

export class MongoDbHelper {
  private client: MongoClient | null = null
  private uri: string = ''
  private static _instance: MongoDbHelper

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor () {}

  static get instance (): MongoDbHelper {
    if (!MongoDbHelper._instance) {
      MongoDbHelper._instance = new MongoDbHelper()
    }
    return MongoDbHelper._instance
  }

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }

  async getCollection (collectionName: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.uri)
    }
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
