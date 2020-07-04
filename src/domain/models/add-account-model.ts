import { AccountModel } from './account-model'

export type AddAccountModel = Omit<AccountModel, 'id'>
