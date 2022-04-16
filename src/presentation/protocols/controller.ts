import { HttpResponse } from './http'

export interface Controller {
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  handle(t: any): Promise<HttpResponse>
}
