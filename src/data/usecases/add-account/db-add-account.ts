import { Encrypter } from '@/data/protocols/encrypter'
import { AddAccount } from '@/domain/usecases/add-account'
import { AddAccountModel } from '@/domain/models/add-account-model'
import { AccountModel } from '@/domain/models/account-model'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return Promise.resolve({} as any)
  }
}
