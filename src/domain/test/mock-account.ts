import { AccountModel } from '../models/account'
import { AddAccountParams } from '../usecases/add-account'

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@gmail.com',
  password: 'any_password'
})

export const mockAccountModel = (): AccountModel => Object.assign({}, mockAddAccountParams(), { id: 'any_id' })
