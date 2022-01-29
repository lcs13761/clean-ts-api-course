export interface AddAccount {
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  add(account: AddAccount.Params): Promise<AddAccount.Result>
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AddAccount {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export type Params = {
    name: string
    email: string
    password: string
  }
  export type Result = Boolean
}
