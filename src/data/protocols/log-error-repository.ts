export interface LogErrorRepository {
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  logError (stack: string): Promise<void>
}
