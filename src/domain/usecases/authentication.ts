// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type AuthenticationParams = {
  email: string
  password: string
}

export interface Authentication {
  auth: (Authentication: AuthenticationParams) => Promise<any>
}
