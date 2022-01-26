export interface Encrypter {
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  encrypt (value: string): Promise<string>
}
