import { AddAccountModel } from '../models/add-account-model'
import { AccountModel } from '../models/account-model'

export interface AddAccount {
  add(account: AddAccountModel): AccountModel
}
