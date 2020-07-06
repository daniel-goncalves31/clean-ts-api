import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator
} from '../sign-up/signup-protocols'
import { badRequest, serverError } from '../../helpers/http-helpers'
import { MissingParamError, InvalidParamError } from '../../errors'
import { Authentication } from '../../../domain/usecases/authentication'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    try {
      const { email, password } = httpRequest.body
      const emailIsValid = this.emailValidator.isValid(email)

      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'))
      }

      await this.authentication.auth(email, password)
      return {} as any
    } catch (error) {
      return serverError(error)
    }
  }
}
