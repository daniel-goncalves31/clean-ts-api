import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LogDecorator implements Controller {
  constructor (private readonly controller: Controller) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.controller.handle(httpRequest)
    return {} as any
  }
}
