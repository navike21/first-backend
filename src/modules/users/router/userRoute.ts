import { Router } from 'express'
import { createUser } from '../controllers'
import { validateUser } from '../middlewares'

export function users(router: Router) {
  router.post('/users', validateUser, createUser)
}
