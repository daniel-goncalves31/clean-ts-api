import { Router } from 'express'
import { makeSignUpController } from '../factories/sign-up'
import { adaptRoute } from '../adapters/express-adapter'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
}
