import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../sign-up/signup-protocols'
import { badRequest } from '../../helpers/http-helpers'
import { MissingParamError } from '../../errors'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return badRequest(new MissingParamError('email'))
  }
}
