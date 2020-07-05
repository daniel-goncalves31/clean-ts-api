import {
  AddAccount,
  Encrypter,
  AddAccountModel,
  AccountModel
} from './db-add-account-protocols'
import { AddAccountRepository } from '@/data/protocols/add-account-repository'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password)
    await this.addAccountRepository.add({
      ...account,
      password: hashedPassword
    })
    return Promise.resolve({} as any)
  }
}
