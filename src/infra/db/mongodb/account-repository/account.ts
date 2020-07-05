import { AddAccountRepository } from '@/data/protocols/add-account-repository'
import { AddAccountModel } from '@/domain/models/add-account-model'
import { AccountModel } from '@/domain/models/account-model'
import { MongoDbHelper } from '../helpers/mongodb-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoDbHelper.instance.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const account = result.ops[0]
    const { _id, ...accountWithoutId } = account
    return { ...accountWithoutId, id: _id }
  }
}