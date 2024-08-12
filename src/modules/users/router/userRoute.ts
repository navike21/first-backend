import { Router } from 'express'
import { createUser } from '../controllers'
import { validateUser } from '../middlewares'

export default (router: Router) => {
  router.post('/users', validateUser, createUser)
}
