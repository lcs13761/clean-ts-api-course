export interface LogErrorRepository {
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  log (stack: string): Promise<void>
}
