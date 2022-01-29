import { AddAccount } from '../../domain/usecases/add-account'

export interface AddAccountRepository {
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  add (accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result>
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AddAccountRepository {
  export type Params = AddAccount.Params
  export type Result = Boolean
}
